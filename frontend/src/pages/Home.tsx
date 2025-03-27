import React, { useState } from "react";
import { NavBar } from "@components/home/NavBar";
import { SideBar } from "@components/home/SideBar";
import CanvasArea from "@components/home/CanvasArea";

// Main App component
const Home: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [users, setUsers] = useState<string[]>([]);

  const createRoom = () => {
    if (roomName.trim()) {
      const roomId = `room_${Date.now()}`;
      setCurrentRoom(roomId);
      setUsers(["You"]);
      setRoomName("");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100">
      {/* Navigation Bar */}
      <NavBar setSidebarOpen={setSidebarOpen} />
      {/* Main Content Area */}
      <div className="flex min-h-screen flex-1 flex-col pt-16 md:flex-row">
        {/* Sidebar */}
        <SideBar
          sidebarOpen={sidebarOpen}
          currentRoom={currentRoom}
          roomName={roomName}
          setRoomName={setRoomName}
          createRoom={createRoom}
          users={users}
        />
        {/* Main Canvas Area */}
        <CanvasArea />
      </div>
    </div>
  );
};

export default Home;
