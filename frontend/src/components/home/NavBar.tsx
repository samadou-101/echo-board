import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  User,
  Settings,
  Plus,
  Save,
  ChevronDown,
  Search,
  PanelLeft,
  Layers,
  LogOut,
  // Share2,
} from "lucide-react";
import Button from "@components/ui/Button";
import ThemeToggle from "@components/ui/ThemeToggle";
import Input from "@components/ui/Inputs";
import Login from "./Login";
import Signup from "./Signup";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@config/firebase";

interface NavBarProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavBar: React.FC<NavBarProps> = ({ setSidebarOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setIsLoggedIn(true);
    } else setIsLoggedIn(false);
  });
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSignup = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
    setIsLoggedIn(false);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center border-b border-gray-200 bg-white/80 px-4 shadow-sm backdrop-blur-md sm:px-6 dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex w-full items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <Layers className="mr-2 h-6 w-6 text-blue-600 sm:h-7 sm:w-7 dark:text-blue-400" />
          <span className="text-lg font-semibold tracking-tight sm:text-xl">
            Echo Board
          </span>
        </div>
        <div className="hidden items-center gap-2 md:flex">
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
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* <Button
            variant="outline"
            size="sm"
            className="hidden items-center sm:flex"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button> */}
          <div className="relative hidden sm:block">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="h-10 w-40 pl-10 shadow-sm md:w-72"
            />
          </div>

          {isLoggedIn ? (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
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
                <DropdownMenu.Item
                  className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : (
            <div className="flex items-center gap-2">
              <Login onLogin={handleLogin} />
              <Signup onSignup={handleSignup} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
