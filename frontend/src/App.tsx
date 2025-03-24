import React, { InputHTMLAttributes, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Separator from "@radix-ui/react-separator";
import {
  User,
  Settings,
  LogOut,
  Plus,
  Grid,
  Share2,
  Save,
  ChevronDown,
  Search,
  PanelLeft,
  Layers,
  Moon,
  Sun,
} from "lucide-react";

// Theme toggle component
const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white dark:focus:ring-offset-gray-900"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
};

// Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    default:
      "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg",
    outline:
      "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:border-gray-600",
    ghost:
      "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800 dark:active:bg-gray-700",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 shadow-sm dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600",
  };

  const sizeStyles = {
    default: "px-4 py-2",
    sm: "text-sm px-3 py-1.5",
    lg: "text-lg px-6 py-3",
    icon: "p-2.5",
  };

  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
};

// Input component
const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => {
  return (
    <input
      className={`rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:ring-offset-gray-900 ${className}`}
      {...props}
    />
  );
};

// Main app component
const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    [],
  );
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState<string[]>([]);

  // Room creation handler
  const createRoom = () => {
    if (roomName.trim()) {
      const roomId = `room_${Date.now()}`; // Simple unique ID
      setCurrentRoom(roomId);
      setUsers(["You"]); // Initialize with current user
      setRoomName("");
    }
  };

  // Message sending handler
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && currentRoom) {
      setMessages([...messages, { user: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-gray-950 dark:text-gray-100">
      {/* Navigation Bar */}
      <header className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center border-b border-gray-200 bg-white/80 px-6 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
        <div className="flex w-full items-center gap-4">
          {/* Logo */}
          <div className="mr-6 flex items-center">
            <Layers className="mr-2 h-7 w-7 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-semibold tracking-tight">
              Echo Board
            </span>
          </div>

          {/* File Operations */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="sm">
                File <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="min-w-[200px] rounded-lg border border-gray-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                <Plus className="mr-2 h-4 w-4" /> New Board
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                <Save className="mr-2 h-4 w-4" /> Save
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-800" />
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Import
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Export
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="sm">
                Edit <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="min-w-[200px] rounded-lg border border-gray-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Undo
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Redo
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-800" />
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Cut
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Copy
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Paste
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="sm">
                View <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="min-w-[200px] rounded-lg border border-gray-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Zoom In
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Zoom Out
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                Fit to Screen
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Collaborators Button */}
          <Button variant="outline" size="sm" className="flex items-center">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          {/* Search */}
          <div className="relative ml-2">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-10 w-72 pl-10 shadow-sm"
            />
          </div>

          {/* User Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="min-w-[200px] rounded-lg border border-gray-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95">
              <DropdownMenu.Label className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                My Account
              </DropdownMenu.Label>
              <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-800" />
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-gray-200 dark:bg-gray-800" />
              <DropdownMenu.Item className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex h-full flex-1 pt-16">
        {/* Left Sidebar with Room Creation */}
        {sidebarOpen && (
          <aside className="w-72 border-r border-gray-200 bg-white/70 p-6 shadow-lg backdrop-blur-md transition-all duration-300 dark:border-gray-800 dark:bg-gray-900/70">
            <div className="flex h-full flex-col">
              {/* Room Creation */}
              {!currentRoom ? (
                <div className="mb-6">
                  <Input
                    placeholder="Room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="mb-2"
                  />
                  <Button
                    onClick={createRoom}
                    className="flex w-full items-center"
                  >
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
                  <Grid className="mr-2 h-4 w-4" />
                  Marketing Campaign
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start"
                >
                  <Grid className="mr-2 h-4 w-4" />
                  User Flow Diagram
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full place-items-center justify-start"
                >
                  <Grid className="mr-2 h-4 w-4" />
                  System Architecture
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
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </Button>
              </div>
            </div>
          </aside>
        )}

        {/* Toggle Sidebar Button */}
        <Button
          variant="default"
          size="icon"
          className="absolute bottom-6 left-6 z-10 rounded-full shadow-lg hover:shadow-xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>

        {/* Main Canvas Area with Chat */}
        <main className="relative flex-1 bg-gray-100 transition-colors duration-200 dark:bg-gray-900">
          {/* Toolbar */}
          <div className="absolute top-6 left-1/2 z-10 -translate-x-1/2 transform rounded-xl border border-gray-200 bg-white/80 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
            <Tabs.Root defaultValue="shape">
              <Tabs.List className="flex border-b border-gray-200 dark:border-gray-800">
                <Tabs.Trigger
                  value="select"
                  className="border-b-2 border-transparent px-5 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
                >
                  Select
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="shape"
                  className="border-b-2 border-transparent px-5 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
                >
                  Shapes
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="connector"
                  className="border-b-2 border-transparent px-5 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
                >
                  Connectors
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="text"
                  className="border-b-2 border-transparent px-5 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
                >
                  Text
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="draw"
                  className="border-b-2 border-transparent px-5 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:text-gray-300 dark:hover:text-blue-300 dark:data-[state=active]:text-blue-400"
                >
                  Draw
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content
                value="shape"
                className="absolute mt-2 flex gap-2 rounded-lg border border-gray-200 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shadow-sm"
                >
                  ◻️
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shadow-sm"
                >
                  ○
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shadow-sm"
                >
                  ◇
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shadow-sm"
                >
                  △
                </Button>
              </Tabs.Content>
              <Tabs.Content
                value="connector"
                className="absolute mt-2 flex gap-2 rounded-lg border border-gray-200 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shadow-sm"
                >
                  →
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shadow-sm"
                >
                  ↔
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 shadow-sm"
                >
                  ⟳
                </Button>
              </Tabs.Content>
            </Tabs.Root>
          </div>

          {/* Canvas with Chat */}
          <div className="flex h-full w-full">
            <div className="flex-1">
              {/* Canvas implementation with cursor sharing would go here */}
            </div>

            {/* Chat Section */}
            {currentRoom && (
              <div className="w-80 border-l border-gray-200 bg-white/70 p-4 dark:border-gray-800 dark:bg-gray-900/70">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
