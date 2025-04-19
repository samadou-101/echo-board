import React, { useState, useEffect } from "react";
import * as Separator from "@radix-ui/react-separator";
import { Plus, Share, Trash2, Save } from "lucide-react";
import Button from "@components/ui/Button";
import Input from "@components/ui/Inputs";
import * as Tabs from "@radix-ui/react-tabs";
import { useAppSelector } from "@hooks/redux/redux-hooks";
import { Canvas } from "fabric";
import {
  deleteCanvas,
  listCanvases,
  loadCanvasToEditor,
  updateCanvas,
} from "@services/canvas/canvasServices";

interface Project {
  projectName: string;
  canvasId: string;
}

interface CanvasResponse {
  canvasId?: string;
  error?: string;
}

interface SideBarProps {
  sidebarOpen: boolean;
  currentRoom: string | null;
  roomName: string;
  setRoomName: (name: string) => void;
  createRoom: () => void;
  joinRoom: () => void;
  users: string[];
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas | null) => void;
}

export const SideBar: React.FC<SideBarProps> = ({
  canvas,
  setCanvas,
  sidebarOpen,
  currentRoom,
  roomName,
  setRoomName,
  createRoom,
  joinRoom,
  users,
}) => {
  const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const isProjectAdded = useAppSelector((state) => state.global.isProjectAdded);
  const isLoggedIn = useAppSelector((state) => state.global.isLoggedIn);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("User not logged in, clearing local state");
      setProjects([]);
      localStorage.removeItem("projects");
      localStorage.removeItem("lastLoadedCanvas");
      canvas?.clear();
      canvas?.renderAll();
      return;
    }

    let isCancelled = false;

    const fetchProjects = async () => {
      console.log("Fetching projects...");
      try {
        const { canvases, error } = await listCanvases();
        if (isCancelled) return;
        if (error) {
          throw new Error(error);
        }
        setProjects(canvases);

        if (canvases.length === 0) return;

        const lastLoadedCanvasId = localStorage.getItem("lastLoadedCanvas");
        if (lastLoadedCanvasId && canvas) {
          console.log(
            "Loading last opened canvas with ID:",
            lastLoadedCanvasId,
          );
          setTimeout(() => {
            if (!isCancelled) {
              loadCanvasToEditor(lastLoadedCanvasId, canvas, setCanvas);
              canvas.renderAll();
            }
          }, 300);
        } else if (canvases.length > 0 && canvas) {
          console.log("Loading first available project:", canvases[0].canvasId);
          setTimeout(() => {
            if (!isCancelled) {
              loadCanvasToEditor(canvases[0].canvasId, canvas, setCanvas);
              canvas.renderAll();
            }
          }, 300);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching projects:", error);
        }
      }
    };

    fetchProjects();

    return () => {
      isCancelled = true;
    };
  }, [canvas, setCanvas, isLoggedIn, isProjectAdded]);

  const handleDeleteProject = async (canvasId: string) => {
    try {
      const response = await deleteCanvas(canvasId);
      if (response.error) {
        console.error(response.error);
        return;
      }

      const updatedProjects = projects.filter(
        (project) => project.canvasId !== canvasId,
      );
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
      const lastLoadedCanvasId = localStorage.getItem("lastLoadedCanvas");
      if (lastLoadedCanvasId === canvasId) {
        localStorage.removeItem("lastLoadedCanvas");
      }

      if (canvas) {
        canvas.clear();
        canvas.renderAll();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleLoadProject = (canvasId: string) => {
    console.log("Attempting to load canvas with ID:", canvasId);
    if (!canvas) {
      console.error("Canvas is not initialized");
      return;
    }
    try {
      localStorage.setItem("lastLoadedCanvas", canvasId);

      setTimeout(() => {
        console.log("Calling loadCanvasToEditor with canvasId:", canvasId);
        loadCanvasToEditor(canvasId, canvas, setCanvas);
        canvas.renderAll();
        console.log("Canvas loaded and rendered");
      }, 300);
    } catch (error) {
      console.error("Failed to load canvas:", error);
    }
  };

  const handleSaveProject = async (project: Project) => {
    if (!canvas) {
      console.error("Canvas is not initialized");
      return;
    }
    try {
      const response: CanvasResponse = await updateCanvas(
        canvas,
        project.canvasId,
      );
      if (response.error) {
        throw new Error(response.error);
      }
      console.log(`Project "${project.projectName}" updated successfully`);
      localStorage.setItem("lastLoadedCanvas", project.canvasId);
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  const handleTabChange = (value: string) => {
    setIsJoiningRoom(value === "join");
  };

  const handleShareRoom = () => {
    if (currentRoom) {
      navigator.clipboard.writeText(currentRoom);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 top-16 left-0 h-[calc(100vh-4rem)] min-w-64 transform border-r border-gray-200 bg-white/70 p-4 shadow-lg backdrop-blur-md transition-all duration-300 sm:px-6 sm:pt-0 md:static md:w-72 md:translate-x-0 dark:border-gray-800 dark:bg-gray-900/70 ${
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
              onClick={handleShareRoom}
            >
              <Share size={20} />
              share room
            </Button>
            {showPopup && (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-green-500 px-4 py-2 text-sm text-white shadow-lg">
                Room copied!
              </div>
            )}
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

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Projects
          </h2>
        </div>
        <Separator.Root className="mt-2 h-px bg-gray-200 dark:bg-gray-800" />

        <div className="mt-2 space-y-2 overflow-y-auto">
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No projects yet. Create one by clicking "Save" in the File menu.
            </p>
          ) : (
            projects.map((project, index) => (
              <div
                key={index}
                className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => handleLoadProject(project.canvasId)}
              >
                <p className="cursor-pointer text-sm font-medium text-gray-800 dark:text-gray-200">
                  {project.projectName}
                </p>
                <div className="flex">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveProject(project);
                    }}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.canvasId);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
