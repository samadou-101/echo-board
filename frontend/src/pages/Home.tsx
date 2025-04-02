import React, { useState, useEffect } from "react";
import { NavBar } from "@components/home/NavBar";
import { SideBar } from "@components/home/SideBar";
import CanvasArea from "@components/home/CanvasArea";
import { useSocketConnection } from "@hooks/useSocketConnection";
import {
  createRoom,
  joinRoom,
  requestUsersInRoom,
} from "@services/socket/room";
import socket from "@services/socket/socket";

const Home: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [users, setUsers] = useState<string[]>([]);

  useSocketConnection();

  // Listen for real-time user updates
  useEffect(() => {
    socket.on("room-users", (updatedUsers: string[]) => {
      console.log("Users in room (real-time):", updatedUsers);
      setUsers(updatedUsers);
    });

    return () => {
      socket.off("room-users");
    };
  }, []);

  const handleCreateRoom = async () => {
    createRoom(roomName, async (response) => {
      if (response.success && response.roomId) {
        setCurrentRoom(response.roomId);
        setRoomName("");
        try {
          const roomUsers = await requestUsersInRoom(response.roomId);
          console.log("Users in room (after create):", roomUsers);
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
          console.log("Users in room (after join):", roomUsers);
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
