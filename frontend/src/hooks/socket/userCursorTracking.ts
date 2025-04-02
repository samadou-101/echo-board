import { useEffect, useState, useRef } from "react";
import socket from "@services/socket/socket";

interface CursorPosition {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  lastUpdate: number;
}

const useCursorTracking = () => {
  // State to hold the visible cursor positions (interpolated)
  const [cursors, setCursors] = useState<{
    [userId: string]: { x: number; y: number };
  }>({});

  // Ref to track cursor data with physics properties
  const cursorData = useRef<{
    [userId: string]: CursorPosition;
  }>({});

  // Animation frame reference
  const animationFrameId = useRef<number | null>(null);
  const lastFrameTime = useRef<number>(performance.now());

  useEffect(() => {
    // Handle incoming cursor position updates
    const handleCursorUpdate = ({
      userId,
      x,
      y,
    }: {
      userId: string;
      x: number;
      y: number;
    }) => {
      const now = performance.now();

      // Update target positions when receiving new data
      if (!cursorData.current[userId]) {
        // First time seeing this cursor - set initial values
        cursorData.current[userId] = {
          x: x,
          y: y,
          targetX: x,
          targetY: y,
          velocityX: 0,
          velocityY: 0,
          lastUpdate: now,
        };

        // Also update state immediately for first appearance
        setCursors((prevCursors) => ({
          ...prevCursors,
          [userId]: { x, y },
        }));
      } else {
        // Calculate time since last update for this user
        const timeDelta = now - cursorData.current[userId].lastUpdate;

        // If it's been a while since the last update, reset velocity to prevent jumps
        if (timeDelta > 100) {
          cursorData.current[userId].velocityX = 0;
          cursorData.current[userId].velocityY = 0;
        }

        // Update the target position and timestamp
        cursorData.current[userId].targetX = x;
        cursorData.current[userId].targetY = y;
        cursorData.current[userId].lastUpdate = now;
      }
    };

    // Animation function for ultra-smooth cursor movement
    const animateCursors = (timestamp: number) => {
      // Calculate time since last frame
      const deltaTime = timestamp - lastFrameTime.current;
      lastFrameTime.current = timestamp;

      // Normalize deltaTime to avoid jumps after tab switching or long frames
      const normalizedDelta = Math.min(deltaTime, 33) / 16.67; // Cap at ~60fps equivalent

      let hasUpdates = false;

      // Process all cursors with spring physics
      Object.keys(cursorData.current).forEach((userId) => {
        const cursor = cursorData.current[userId];

        // Spring constants - adjust these for different feels
        const springStrength = 0.05 * normalizedDelta; // Lower = smoother but slower
        const damping = 0.85; // Higher = less oscillation

        // Calculate the difference between current and target
        const dx = cursor.targetX - cursor.x;
        const dy = cursor.targetY - cursor.y;

        // Apply spring physics
        // Force = distance * spring strength
        cursor.velocityX = cursor.velocityX * damping + dx * springStrength;
        cursor.velocityY = cursor.velocityY * damping + dy * springStrength;

        // Apply velocity to position
        cursor.x += cursor.velocityX;
        cursor.y += cursor.velocityY;

        // Determine if there's meaningful movement
        const isMoving =
          Math.abs(cursor.velocityX) > 0.01 ||
          Math.abs(cursor.velocityY) > 0.01 ||
          Math.abs(dx) > 0.1 ||
          Math.abs(dy) > 0.1;

        if (isMoving) {
          hasUpdates = true;
        }
      });

      // Only update state if any cursor actually moved
      if (hasUpdates) {
        // Convert internal tracking data to the format needed for rendering
        const updatedPositions: { [userId: string]: { x: number; y: number } } =
          {};
        Object.keys(cursorData.current).forEach((userId) => {
          const { x, y } = cursorData.current[userId];
          updatedPositions[userId] = {
            x: Math.round(x),
            y: Math.round(y),
          };
        });

        setCursors(updatedPositions);
      }

      // Continue animation loop
      animationFrameId.current = requestAnimationFrame(animateCursors);
    };

    // Set up event listener
    socket.on("cursor-update", handleCursorUpdate);

    // Start animation loop
    animationFrameId.current = requestAnimationFrame(animateCursors);

    // Cleanup function
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      socket.off("cursor-update", handleCursorUpdate);
    };
  }, []);

  return cursors;
};

export default useCursorTracking;
