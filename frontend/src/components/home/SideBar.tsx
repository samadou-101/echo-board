import React, { useState } from "react";
import * as Separator from "@radix-ui/react-separator";
import { Plus, Grid, Settings, Share } from "lucide-react";
import Button from "@components/ui/Button";
import Input from "@components/ui/Inputs";
import * as Tabs from "@radix-ui/react-tabs";

interface SideBarProps {
  sidebarOpen: boolean;
  currentRoom: string | null;
  roomName: string;
  setRoomName: (name: string) => void;
  createRoom: () => void;
  joinRoom: () => void;
  users: string[];
}

export const SideBar: React.FC<SideBarProps> = ({
  sidebarOpen,
  currentRoom,
  roomName,
  setRoomName,
  createRoom,
  joinRoom,
  users,
}) => {
  const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);

  const handleTabChange = (value: string) => {
    setIsJoiningRoom(value === "join");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white/70 p-4 shadow-lg backdrop-blur-md transition-all duration-300 sm:px-6 sm:pt-0 md:static md:w-72 md:translate-x-0 dark:border-gray-800 dark:bg-gray-900/70 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <Tabs.Root
          className="mb-2"
          defaultValue="create"
          onValueChange={handleTabChange}
        >
          <Tabs.List className="flex flex-wrap justify-center border-b border-gray-200 dark:border-gray-800">
            <Tabs.Trigger
              value="create"
              className="border-b-2 border-transparent px-3 py-2 text-xs font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 sm:px-5 sm:py-3 sm:text-sm dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
            >
              create
            </Tabs.Trigger>
            <Tabs.Trigger
              value="join"
              className="border-b-2 border-transparent px-3 py-2 text-xs font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 sm:px-5 sm:py-3 sm:text-sm dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
            >
              join
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        {currentRoom ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Room: {currentRoom}</h2>
            <div className="mt-2">
              <h3 className="text-sm font-medium">Users:</h3>
              {users.map((user) => (
                <div key={user} className="text-sm">
                  {user}
                </div>
              ))}
            </div>
            <Button
              size="sm"
              variant="default"
              className="mt-1 flex w-[55%] items-center justify-around p-1"
            >
              <Share size={20} />
              share room
            </Button>
          </div>
        ) : (
          <div className="mb-6">
            <Input
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="mb-2 w-full"
            />
            <Button
              onClick={isJoiningRoom ? joinRoom : createRoom}
              className="flex w-full items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              {isJoiningRoom ? "Join Room" : "Create Room"}
            </Button>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Projects
          </h2>
          <Button size="sm" variant="ghost" className="p-1">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start shadow-sm"
          >
            <Grid className="mr-2 h-4 w-4" /> Marketing Campaign
          </Button>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start"
          >
            <Grid className="mr-2 h-4 w-4" /> User Flow Diagram
          </Button>
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start"
          >
            <Grid className="mr-2 h-4 w-4" /> System Architecture
          </Button>
        </div>
        <Separator.Root className="my-6 h-px bg-gray-200 dark:bg-gray-800" />
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Templates
          </h2>
        </div>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            Mind Map
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Flowchart
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Kanban Board
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Wireframe
          </Button>
        </div>
        <div className="mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex w-full items-center justify-center shadow-sm"
          >
            <Settings className="mr-2 h-4 w-4" /> Preferences
          </Button>
        </div>
      </div>
    </aside>
  );
};
