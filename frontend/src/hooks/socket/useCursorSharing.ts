import { useEffect, useRef } from "react";
import socket from "@services/socket/socket";

interface CursorPosition {
  x: number;
  y: number;
}

const useCursorSharing = (userId: string | null) => {
  const currentPosition = useRef<CursorPosition>({ x: 0, y: 0 });
  const targetPosition = useRef<CursorPosition>({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // Function to handle mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      // Update target position immediately
      targetPosition.current = { x: clientX, y: clientY };
    };

    // Animation loop for smooth interpolation
    const animateCursor = () => {
      // Calculate the difference between current and target positions
      const dx = targetPosition.current.x - currentPosition.current.x;
      const dy = targetPosition.current.y - currentPosition.current.y;

      // Apply easing (lerp - linear interpolation)
      // The 0.2 factor controls the smoothness - lower values = smoother but slower
      currentPosition.current.x += dx * 0.2;
      currentPosition.current.y += dy * 0.2;

      // Only emit if we've moved a meaningful amount or are close to target
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        if (userId) {
          // Calculate position as percentage of viewport dimensions
          const xPercent =
            (currentPosition.current.x / window.innerWidth) * 100;
          const yPercent =
            (currentPosition.current.y / window.innerHeight) * 100;

          socket.emit("cursor-move", {
            userId,
            x: Math.round(xPercent * 100) / 100, // Round to 2 decimal places
            y: Math.round(yPercent * 100) / 100, // Round to 2 decimal places
            screenWidth: window.innerWidth, // Optional: send screen dimensions for reference
            screenHeight: window.innerHeight, // Optional: can be useful for the receiver
          });
        }
      } else {
        // If we're very close to target, snap to it
        currentPosition.current = { ...targetPosition.current };
      }

      // Continue animation loop
      animationFrameId.current = requestAnimationFrame(animateCursor);
    };

    // Start animation and add event listener
    animationFrameId.current = requestAnimationFrame(animateCursor);
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [userId]);
};

export default useCursorSharing;
