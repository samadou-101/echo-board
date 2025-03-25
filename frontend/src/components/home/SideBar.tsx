import React from "react";
import * as Separator from "@radix-ui/react-separator";
import { Plus, Grid, Settings } from "lucide-react";
import Button from "@components/ui/Button";
import Input from "@components/ui/Inputs";

interface SideBarProps {
  sidebarOpen: boolean;
  currentRoom: string | null;
  roomName: string;
  setRoomName: (name: string) => void;
  createRoom: () => void;
  users: string[];
}

export const SideBar: React.FC<SideBarProps> = ({
  sidebarOpen,
  currentRoom,
  roomName,
  setRoomName,
  createRoom,
  users,
}) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white/70 p-4 shadow-lg backdrop-blur-md transition-all duration-300 sm:p-6 md:static md:w-72 md:translate-x-0 dark:border-gray-800 dark:bg-gray-900/70 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        {!currentRoom ? (
          <div className="mb-6">
            <Input
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="mb-2 w-full"
            />
            <Button onClick={createRoom} className="flex w-full items-center">
              <Plus className="mr-2 h-4 w-4" /> Create Room
            </Button>
          </div>
        ) : (
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
