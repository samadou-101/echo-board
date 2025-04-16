/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Button from "@components/ui/Button";
import * as Tabs from "@radix-ui/react-tabs";
import { Canvas } from "fabric";
import socket from "@services/socket/socket";
import { useAppSelector } from "@hooks/redux/redux-hooks";
import { useInitCanvas } from "@hooks/canvas/useInitCanvas";
import { useCanvasMode } from "@hooks/canvas/useCanvasMode";
import { useCanvasSync } from "@hooks/canvas/useCanvasSync";
import { useCanvasResize } from "@hooks/canvas/useCanvasResize";
import { useCanvasPan } from "@hooks/canvas/useCanvasPan";
import { useRoomInitialization } from "@hooks/canvas/useRoomInitialization";
import { CanvasMode } from "@utils/canvas/canvasUtils";
import { Hand, MousePointer2 } from "lucide-react";

interface CanvasAreaProps {
  setCanvas: React.Dispatch<React.SetStateAction<Canvas | null>>;
  mode: CanvasMode;
  setMode: React.Dispatch<React.SetStateAction<CanvasMode>>;
  lineWidth: number;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  handleModeChange: (
    newMode: CanvasMode,
    setMode: React.Dispatch<React.SetStateAction<CanvasMode>>,
  ) => void;
  handleTabChange: (
    value: string,
    handleModeChange: (newMode: CanvasMode) => void,
  ) => void;
  handleClearCanvas: (canvas: Canvas | null, roomId: string | null) => void;
  handleLineWidthChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    setLineWidth: React.Dispatch<React.SetStateAction<number>>,
    mode: CanvasMode,
    canvas: Canvas | null,
    color: string,
  ) => void;
  handleColorChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    setColor: React.Dispatch<React.SetStateAction<string>>,
    mode: CanvasMode,
    canvas: Canvas | null,
    lineWidth: number,
  ) => void;
}

export default function CanvasArea({
  setCanvas,
  mode,
  setMode,
  lineWidth,
  setLineWidth,
  color,
  setColor,
  handleModeChange,
  handleTabChange,
  handleClearCanvas,
  handleLineWidthChange,
  handleColorChange,
}: CanvasAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setLocalCanvas] = useState<Canvas | null>(null);
  const roomId = useAppSelector((state) => state.global.roomId);
  const isReceivingUpdate = useRef(false);
  const mouseDownRef = useRef(false);
  const lastObjectRef = useRef<unknown>(null);
  const throttleTimeoutRef = useRef<number | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // Initialize canvas and update parent state
  useInitCanvas({ setIsCanvasReady, canvasRef, setCanvas: setLocalCanvas });
  useEffect(() => {
    setCanvas(canvas);
  }, [canvas, setCanvas]);

  // Use extracted hooks
  useCanvasResize(canvas, canvasRef, isCanvasReady);
  useRoomInitialization(canvas, canvasRef, roomId, isCanvasReady);
  useCanvasMode({ canvas, mode, color, lineWidth });
  useCanvasSync({
    canvas,
    roomId,
    socket,
    isReceivingUpdate,
    mouseDownRef,
    lastObjectRef,
    throttleTimeoutRef,
  });
  useCanvasPan(canvas, mode);
  return (
    <main className="relative flex h-[calc(100vh-4rem)] flex-1 flex-col pt-24 transition-colors duration-200 dark:bg-gray-900">
      <div className="fixed top-24 left-[55%] z-10 w-[30%] max-w-screen-lg -translate-x-1/2 transform px-4 max-2xl:w-[40%] max-xl:w-[45%] max-lg:left-[65%] max-lg:w-[60%] max-md:left-1/2 max-md:w-[80%]">
        <Tabs.Root
          defaultValue="select"
          onValueChange={(value) =>
            handleTabChange(value, (newMode) =>
              handleModeChange(newMode, setMode),
            )
          }
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
            value="select"
            className="mt-2 flex flex-wrap justify-center gap-2 rounded-lg border border-gray-200 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95"
          >
            <Button
              variant="outline"
              size="icon"
              className={`flex h-9 w-9 items-center justify-center shadow-sm ${
                mode === "select"
                  ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
              onClick={() => handleModeChange("select", setMode)}
            >
              <MousePointer2 />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`flex h-9 w-9 items-center justify-center shadow-sm ${
                mode === "pan"
                  ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
              onClick={() => handleModeChange("pan", setMode)}
            >
              <Hand style={{ width: "32px", height: "32px" }} />
            </Button>
          </Tabs.Content>
          <Tabs.Content
            value="shape"
            className="mt-2 flex flex-wrap justify-center gap-2 rounded-lg border border-gray-200 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95"
          >
            <Button
              variant="outline"
              size="icon"
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${
                mode === "rectangle"
                  ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
              onClick={() => handleModeChange("rectangle", setMode)}
            >
              ◻️
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${
                mode === "circle"
                  ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
              onClick={() => handleModeChange("circle", setMode)}
            >
              ○
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${
                mode === "rhombus"
                  ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
              onClick={() => handleModeChange("rhombus", setMode)}
            >
              ◇
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${
                mode === "triangle"
                  ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
              onClick={() => handleModeChange("triangle", setMode)}
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
          <Tabs.Content
            value="draw"
            className="mt-2 flex flex-wrap justify-center gap-2 rounded-lg border border-gray-200 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95"
          >
            <select
              className="h-8 rounded border px-2 dark:bg-gray-800"
              value={lineWidth}
              onChange={(e) =>
                handleLineWidthChange(e, setLineWidth, mode, canvas, color)
              }
            >
              <option value="2">Thin (2px)</option>
              <option value="5">Medium (5px)</option>
              <option value="10">Thick (10px)</option>
            </select>
            <input
              type="color"
              className="h-8 w-8 rounded"
              value={color}
              onChange={(e) =>
                handleColorChange(e, setColor, mode, canvas, lineWidth)
              }
            />
            <Button
              variant="outline"
              size="icon"
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${
                mode === "draw"
                  ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
              onClick={() => handleModeChange("draw", setMode)}
            >
              ✏️
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${
                mode === "erase"
                  ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                  : ""
              }`}
              onClick={() => handleModeChange("erase", setMode)}
            >
              🧹
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="flex h-8 w-8 items-center justify-center shadow-sm"
              onClick={() => handleClearCanvas(canvas, roomId)}
            >
              🗑️
            </Button>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      <div className="relative flex h-full w-full flex-col md:flex-row">
        <div className="absolute inset-0 flex items-center justify-center">
          {!isCanvasReady && <p className="text-gray-500">Loading canvas...</p>}
        </div>
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{
            cursor:
              mode === "draw"
                ? "crosshair"
                : mode === "erase"
                  ? "cell"
                  : mode === "select"
                    ? "default"
                    : mode === "pan"
                      ? canvas?.defaultCursor === "grabbing"
                        ? "grabbing"
                        : "grab"
                      : "pointer",
          }}
        />
      </div>
    </main>
  );
}
