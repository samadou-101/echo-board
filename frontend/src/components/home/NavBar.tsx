/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "lucide-react";
import Button from "@components/ui/Button";
import ThemeToggle from "@components/ui/ThemeToggle";
import Input from "@components/ui/Inputs";
import Login from "./Login";
import Signup from "./Signup";
import LoginModal from "./LoginModal";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@config/firebase";
import { Canvas } from "fabric";
import { saveCanvas } from "@services/canvas/canvasServices";
import { CanvasResponse } from "@services/canvas/canvasServices";
import { useAppDispatch, useAppSelector } from "@hooks/redux/redux-hooks";
import {
  resetProjects,
  setIsLoggedIn,
  setIsProjectAdded,
} from "@redux/slices/globalSlice";

interface NavBarProps {
  canvas: Canvas | null;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NavBar: React.FC<NavBarProps> = ({ setSidebarOpen, canvas }) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.global.isLoggedIn);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setIsLoggedIn(true));
    } else {
      dispatch(setIsLoggedIn(false));
    }
  });

  const handleLogin = () => {
    dispatch(setIsLoggedIn(true));
  };

  const handleSignup = () => {
    dispatch(setIsLoggedIn(true));
  };
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        localStorage.removeItem("projects"); // Clear localStorage first
        localStorage.removeItem("lastLoadedCanvas");
        dispatch(resetProjects()); // Clear projects state
        dispatch(setIsProjectAdded(false)); // Reset project added state
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
    console.log("Dispatching setIsLoggedIn(false)");
    dispatch(setIsLoggedIn(false)); // Trigger useEffect in SideBar
  };
  // const handleLogout = () => {
  //   signOut(auth)
  //     .then(() => {
  //       console.log("User signed out");
  //     })
  //     .catch((error) => {
  //       console.error("Error signing out:", error);
  //     });
  //   dispatch(setIsLoggedIn(false));
  // };

  const handleSaveCanvas = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      setIsSaveModalOpen(false);
      return;
    }
    if (!canvas) {
      console.error("No canvas available to save");
      return;
    }
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    if (!projectName.trim()) {
      alert("Project name is required");
      return;
    }

    try {
      const response: CanvasResponse = await saveCanvas(canvas!, projectName);

      if (response.error) {
        throw new Error(response.error);
      }

      if (response.canvasId) {
        const existingProjectsData = localStorage.getItem("projects");
        const projects = existingProjectsData
          ? JSON.parse(existingProjectsData)
          : [];

        const newProject = {
          projectName,
          canvasId: response.canvasId,
        };

        const existingProjectIndex = projects.findIndex(
          (project: any) => project.projectName === projectName,
        );

        if (existingProjectIndex !== -1) {
          projects[existingProjectIndex] = newProject;
        } else {
          projects.push(newProject);
        }
        localStorage.setItem("projects", JSON.stringify(projects));
        localStorage.setItem("lastLoadedCanvas", response.canvasId);

        // dispatch(setIsProjectAdded());
      }
      console.log(`Canvas saved successfully as "${projectName}"`);
      setIsSaveModalOpen(false);
      dispatch(setIsProjectAdded(true)); // Reset project added state
      setProjectName("");
    } catch (error) {
      console.error("Failed to save canvas:", error);
      alert("Failed to save canvas");
    }
  };

  const handleCancelSave = () => {
    setIsSaveModalOpen(false);
    setProjectName("");
  };

  const handleNewBoard = () => {
    if (canvas) {
      canvas.clear();
      canvas.renderAll();
      localStorage.removeItem("lastLoadedCanvas");
    }
  };

  return (
    <>
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
                <DropdownMenu.Item
                  className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleNewBoard}
                >
                  <Plus className="mr-2 h-4 w-4" /> New Board
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={handleSaveCanvas}
                >
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

      {isSaveModalOpen && isLoggedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white/95 p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900/95">
            <h2 className="mb-4 text-lg font-semibold">Save Project</h2>
            <Input
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mb-4 w-full"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelSave}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
      {isLoginModalOpen && (
        <LoginModal
          open={isLoginModalOpen}
          onOpenChange={setIsLoginModalOpen}
          onLogin={() => {
            setIsLoginModalOpen(false);
            handleLogin();
            setIsSaveModalOpen(true);
          }}
        />
      )}
    </>
  );
};
