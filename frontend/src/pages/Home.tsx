import React, { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import Button from "@components/ui/Button";
import Input from "@components/ui/Inputs";
import { NavBar } from "@components/home/NavBar";
import { SideBar } from "@components/home/SideBar";

// Main App component
const Home: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    [],
  );
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<string[]>([]);

  const createRoom = () => {
    if (roomName.trim()) {
      const roomId = `room_${Date.now()}`;
      setCurrentRoom(roomId);
      setUsers(["You"]);
      setRoomName("");
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && currentRoom) {
      setMessages([...messages, { user: "You", text: newMessage }]);
      setNewMessage("");
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
        <main className="relative flex h-[calc(100vh-4rem)] flex-1 flex-col pt-24 transition-colors duration-200 dark:bg-gray-900">
          <div className="absolute top-4 left-1/2 z-10 h-[40%] max-w-xs -translate-x-1/2 px-4 sm:max-w-md md:max-w-lg">
            <Tabs.Root
              defaultValue="shape"
              className="rounded-xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80"
            >
              <Tabs.List className="flex flex-wrap justify-center border-b border-gray-200 dark:border-gray-800">
                <Tabs.Trigger
                  value="select"
                  className="border-b-2 border-transparent px-3 py-2 text-xs font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 sm:px-5 sm:py-3 sm:text-sm dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
                >
                  Select
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="shape"
                  className="border-b-2 border-transparent px-3 py-2 text-xs font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 sm:px-5 sm:py-3 sm:text-sm dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
                >
                  Shapes
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="connector"
                  className="border-b-2 border-transparent px-3 py-2 text-xs font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 sm:px-5 sm:py-3 sm:text-sm dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
                >
                  Connectors
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="text"
                  className="border-b-2 border-transparent px-3 py-2 text-xs font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 sm:px-5 sm:py-3 sm:text-sm dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
                >
                  Text
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="draw"
                  className="border-b-2 border-transparent px-3 py-2 text-xs font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 sm:px-5 sm:py-3 sm:text-sm dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
                >
                  Draw
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content
                value="shape"
                className="mt-2 flex flex-wrap justify-center gap-2 rounded-lg border border-gray-200 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="flex h-8 w-8 items-center justify-center shadow-sm sm:h-9 sm:w-9"
                >
                  ◻️
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex h-8 w-8 items-center justify-center shadow-sm sm:h-9 sm:w-9"
                >
                  ○
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex h-8 w-8 items-center justify-center shadow-sm sm:h-9 sm:w-9"
                >
                  ◇
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="flex h-8 w-8 items-center justify-center shadow-sm sm:h-9 sm:w-9"
                >
                  △
                </Button>
              </Tabs.Content>
              <Tabs.Content
                value="connector"
                className="mt-2 flex flex-wrap justify-center gap-2 rounded-lg border border-gray-200 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shadow-sm sm:h-9 sm:w-9"
                >
                  →
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shadow-sm sm:h-9 sm:w-9"
                >
                  ↔
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shadow-sm sm:h-9 sm:w-9"
                >
                  ⟳
                </Button>
              </Tabs.Content>
            </Tabs.Root>
          </div>
          <div className="flex h-full flex-col md:flex-row">
            <div className="flex-1" />
            {currentRoom && (
              <div className="w-full border-t border-gray-200 bg-white/70 p-4 md:w-80 md:border-t-0 md:border-l dark:border-gray-800 dark:bg-gray-900/70">
                <div className="flex h-full flex-col">
                  <h3 className="mb-4 text-lg font-semibold">Chat</h3>
                  <div className="mb-4 flex-1 overflow-y-auto">
                    {messages.map((msg, idx) => (
                      <div key={idx} className="mb-2">
                        <span className="font-medium">{msg.user}: </span>
                        <span>{msg.text}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      Send
                    </Button>
                  </form>
                </div>
              </div>
            )}
            <canvas className="h-full w-full self-center bg-gray-200"></canvas>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
