import React, { useState, useEffect } from "react";
import { NavBar } from "@components/home/NavBar";
import { SideBar } from "@components/home/SideBar";
import CanvasArea from "@components/home/CanvasArea";
import { useSocketConnection } from "@hooks/socket/useSocketConnection";
import {
  createRoom,
  joinRoom,
  requestUsersInRoom,
} from "@services/socket/room";
import socket from "@services/socket/socket";
import useCursorSharing from "@hooks/socket/useCursorSharing";
import useCursorTracking from "@hooks/socket/userCursorTracking";

const getUserColor = (userId: string) => {
  const hash = userId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `hsl(${hash % 360}, 70%, 50%)`;
};

const Home: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [users, setUsers] = useState<string[]>([]);

  const userId = useSocketConnection();
  const cursors = useCursorTracking();
  useCursorSharing(userId);

  // User presence tracking
  const [userPresence, setUserPresence] = useState<{
    [userId: string]: { active: boolean; lastActive: number };
  }>({});

  // Track when users were last active
  useEffect(() => {
    const presenceInterval = setInterval(() => {
      const now = Date.now();
      const updatedPresence = { ...userPresence };
      let hasChanges = false;

      // Update activity status for each user
      Object.entries(updatedPresence).forEach(([id, data]) => {
        // Mark users as inactive after 5 seconds of no movement
        if (data.active && now - data.lastActive > 5000) {
          updatedPresence[id].active = false;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setUserPresence(updatedPresence);
      }
    }, 1000);

    return () => clearInterval(presenceInterval);
  }, [userPresence]);

  // Update presence when cursor data changes
  useEffect(() => {
    const now = Date.now();
    const updatedPresence = { ...userPresence };
    let hasChanges = false;

    Object.keys(cursors).forEach((id) => {
      if (!updatedPresence[id] || !updatedPresence[id].active) {
        updatedPresence[id] = { active: true, lastActive: now };
        hasChanges = true;
      } else {
        updatedPresence[id].lastActive = now;
      }
    });

    if (hasChanges) {
      setUserPresence(updatedPresence);
    }
  }, [cursors]);

  useEffect(() => {
    const handleUserUpdate = (updatedUsers: string[]) => {
      console.log("Users in room (real-time):", updatedUsers);
      setUsers(updatedUsers);
    };

    socket.on("room-users", handleUserUpdate);
    return () => {
      socket.off("room-users", handleUserUpdate);
    };
  }, []);

  const handleCreateRoom = async () => {
    createRoom(roomName, async (response) => {
      if (response.success && response.roomId) {
        setCurrentRoom(response.roomId);
        setRoomName("");
        try {
          const roomUsers = await requestUsersInRoom(response.roomId);
          setUsers(roomUsers);
        } catch (error) {
          console.error("Failed to get users:", error);
        }
      } else {
        console.error("Failed to create room:", response.error);
      }
    });
  };

  const handleJoinRoom = async () => {
    joinRoom(roomName, async (response) => {
      if (response.success && response.roomId) {
        setCurrentRoom(response.roomId);
        setRoomName("");
        try {
          const roomUsers = await requestUsersInRoom(response.roomId);
          setUsers(roomUsers);
        } catch (error) {
          console.error("Failed to get users:", error);
        }
      } else {
        console.error("Failed to join room:", response.error);
      }
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100">
      {/* Cursor container with very high z-index */}
      <div className="pointer-events-none absolute inset-0 z-[1000]">
        {Object.entries(cursors)
          .filter(([id]) => id !== userId)
          .map(([id, { x, y }]) => {
            const isActive = userPresence[id]?.active ?? true;
            return (
              <div
                key={id}
                className="cursor"
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  pointerEvents: "none",
                  zIndex: 1000,
                  opacity: isActive ? 1 : 0.6,
                  transition: "opacity 0.3s ease-out",
                }}
              >
                {/* Arrow pointing top-left */}
                <svg
                  width="36" // Slightly larger for better presence
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    transform: "translate(-4px, -12px) rotate(45deg)", // Adjusted positioning
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))", // Stronger shadow
                  }}
                >
                  <path
                    d="M19 19L12 12L19 5L5 12Z" // Slightly adjusted path for cleaner shape
                    // fill={getUserColor(id)}
                    stroke="white"
                    strokeWidth="4.5" // Thicker stroke for boldness
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      filter: "brightness(1.1)", // Subtle brightness boost
                    }}
                  />
                  {/* Optional inner glow effect */}
                  <path
                    d="M19 19L12 12L19 5L5 12Z"
                    fill={getUserColor(id)} // Light inner glow
                    stroke="none"
                  />
                </svg>
                {/* Username label */}
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "20px",
                    color: "white",
                    fontSize: "11px",
                    fontWeight: "500",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    whiteSpace: "nowrap",
                    backgroundColor: `${getUserColor(id)}e0`,
                    padding: "3px 8px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                    zIndex: 1001,
                    opacity: isActive ? 1 : 0.7,
                    transition: "all 0.3s ease-out",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {id.slice(0, 4)}
                </div>
              </div>
            );
          })}
      </div>

      <NavBar setSidebarOpen={setSidebarOpen} />
      <div className="flex min-h-screen flex-1 flex-col pt-16 md:flex-row">
        <SideBar
          sidebarOpen={sidebarOpen}
          currentRoom={currentRoom}
          roomName={roomName}
          setRoomName={setRoomName}
          createRoom={handleCreateRoom}
          joinRoom={handleJoinRoom}
          users={users}
        />
        <CanvasArea />
      </div>
    </div>
  );
};

export default Home;
