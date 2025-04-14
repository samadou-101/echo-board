// NavBar.tsx
import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import {
  User,
  Settings,
  LogOut,
  Plus,
  Save,
  ChevronDown,
  Search,
  PanelLeft,
  Layers,
  Share2,
  X,
  Mail,
  Lock,
} from "lucide-react";
import Button from "@components/ui/Button";
import ThemeToggle from "@components/ui/ThemeToggle";
import Input from "@components/ui/Inputs";

interface NavBarProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavBar: React.FC<NavBarProps> = ({ setSidebarOpen }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
          <Button
            variant="outline"
            size="sm"
            className="hidden items-center sm:flex"
          >
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
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
                  onClick={() => setIsLoggedIn(false)}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : (
            <div className="flex items-center gap-2">
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-medium">
                        Login
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </Dialog.Close>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium"
                        >
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            className="pl-10"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">Remember me</span>
                        </label>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setIsLoggedIn(true);
                        }}
                      >
                        Login
                      </Button>
                      <div className="text-center text-sm">
                        Don't have an account?{" "}
                        <Dialog.Close asChild>
                          <a
                            href="#"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Sign up
                          </a>
                        </Dialog.Close>
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <Dialog.Title className="text-lg font-medium">
                        Create an account
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </Dialog.Close>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="first-name"
                            className="block text-sm font-medium"
                          >
                            First name
                          </label>
                          <Input id="first-name" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium"
                          >
                            Last name
                          </label>
                          <Input id="last-name" placeholder="Doe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="signup-email"
                          className="block text-sm font-medium"
                        >
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            className="pl-10"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="signup-password"
                          className="block text-sm font-medium"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="signup-password"
                            type="password"
                            className="pl-10"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="confirm-password"
                          className="block text-sm font-medium"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirm-password"
                            type="password"
                            className="pl-10"
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">
                          I agree to the terms and conditions
                        </span>
                      </label>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setIsLoggedIn(true);
                        }}
                      >
                        Sign Up
                      </Button>
                      <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Dialog.Close asChild>
                          <a
                            href="#"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Login
                          </a>
                        </Dialog.Close>
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
