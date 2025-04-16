/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { setRoomId } from "@redux/slices/globalSlice";
import { useAppDispatch } from "@hooks/redux/redux-hooks";
import Chat from "@components/home/Chat";
import OptionsPanel from "@components/home/OptionsPanel";
import { Canvas } from "fabric";
import {
  CanvasMode,
  handleModeChange,
  handleTabChange,
  handleClearCanvas,
  handleLineWidthChange,
  handleColorChange,
} from "@utils/canvas/canvasUtils";

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
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [mode, setMode] = useState<CanvasMode>("select");
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [color, setColor] = useState<string>("#000000");

  const userId = useSocketConnection();
  const cursors = useCursorTracking();
  useCursorSharing(userId);
  const dispatch = useAppDispatch();
  const [userPresence, setUserPresence] = useState<{
    [userId: string]: { active: boolean; lastActive: number };
  }>({});

  useEffect(() => {
    const presenceInterval = setInterval(() => {
      const now = Date.now();
      const updatedPresence = { ...userPresence };
      let hasChanges = false;

      Object.entries(updatedPresence).forEach(([id, data]) => {
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
        dispatch(setRoomId(response.roomId));
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
        dispatch(setRoomId(response.roomId));
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
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    transform: "translate(-4px, -12px) rotate(45deg)",
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))",
                  }}
                >
                  <path
                    d="M19 19L12 12L19 5L5 12Z"
                    stroke="white"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: "brightness(1.1)" }}
                  />
                  <path
                    d="M19 19L12 12L19 5L5 12Z"
                    fill={getUserColor(id)}
                    stroke="none"
                  />
                </svg>
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
                    backgroundColor: getUserColor(id),
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
      <OptionsPanel />
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
        <CanvasArea
          setCanvas={setCanvas}
          mode={mode}
          setMode={setMode}
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
          color={color}
          setColor={setColor}
          handleModeChange={handleModeChange}
          handleTabChange={handleTabChange}
          handleClearCanvas={handleClearCanvas}
          handleLineWidthChange={handleLineWidthChange}
          handleColorChange={handleColorChange}
        />
        <Chat userId={userId!} roomId={currentRoom} />
      </div>
    </div>
  );
};

export default Home;
