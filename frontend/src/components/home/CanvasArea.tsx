import { useState, useRef, useEffect } from "react";
import Button from "@components/ui/Button";
import * as Tabs from "@radix-ui/react-tabs";
import {
  startDrawing,
  draw,
  stopDrawing,
  clearCanvas,
  initializeCanvas,
} from "@utils/canvas/canvas-utils";

export default function CanvasArea() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [color, setColor] = useState<string>("#000000");
  const [mode, setMode] = useState<
    "draw" | "erase" | "circle" | "rectangle" | "triangle" | "rhombus"
  >("draw");
  const [isDrawEnabled, setIsDrawEnabled] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    initializeCanvas(canvasRef, previewCanvasRef, contextRef);
  }, []);

  const handleModeChange = (
    newMode: "draw" | "erase" | "circle" | "rectangle" | "triangle" | "rhombus",
  ) => {
    setMode(newMode);
    setIsDrawEnabled(newMode === "draw" || newMode === "erase");
    if (canvasRef.current) {
      canvasRef.current.style.cursor =
        newMode === "erase" ? "cell" : "crosshair";
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "draw") {
      handleModeChange("draw");
    } else if (canvasRef.current) {
      canvasRef.current.style.cursor = "default";
      setIsDrawEnabled(false);
      setMode("draw");
    }
  };

  return (
    <main className="relative flex h-[calc(100vh-4rem)] flex-1 flex-col pt-24 transition-colors duration-200 dark:bg-gray-900">
      <div className="absolute top-4 left-1/2 z-10 h-fit max-w-xs -translate-x-1/2 px-4 sm:max-w-md md:max-w-lg">
        <Tabs.Root
          defaultValue="shape"
          onValueChange={handleTabChange}
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
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${mode === "rectangle" ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : ""}`}
              onClick={() => handleModeChange("rectangle")}
            >
              ◻️
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${mode === "circle" ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : ""}`}
              onClick={() => handleModeChange("circle")}
            >
              ○
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${mode === "rhombus" ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : ""}`}
              onClick={() => handleModeChange("rhombus")}
            >
              ◇
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${mode === "triangle" ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : ""}`}
              onClick={() => handleModeChange("triangle")}
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
              onChange={(e) => setLineWidth(Number(e.target.value))}
            >
              <option value="2">Thin (2px)</option>
              <option value="5">Medium (5px)</option>
              <option value="10">Thick (10px)</option>
            </select>
            <input
              type="color"
              className="h-8 w-8 rounded"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <Button
              variant="outline"
              size="icon"
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${mode === "draw" ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : ""}`}
              onClick={() => handleModeChange("draw")}
            >
              ✏️
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${mode === "erase" ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : ""}`}
              onClick={() => handleModeChange("erase")}
            >
              🧹
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="flex h-8 w-8 items-center justify-center shadow-sm"
              onClick={() =>
                clearCanvas(canvasRef, contextRef, previewCanvasRef)
              }
            >
              🗑️
            </Button>
          </Tabs.Content>
        </Tabs.Root>
      </div>
      <div className="relative flex h-full flex-col md:flex-row">
        <div className="flex-1" />
        <canvas
          ref={canvasRef}
          className="h-full w-full self-center bg-gray-100"
          onMouseDown={(e) =>
            startDrawing(
              e,
              mode,
              isDrawEnabled,
              setStartPos,
              setIsDrawing,
              contextRef,
            )
          }
          onMouseMove={(e) =>
            draw(
              e,
              mode,
              isDrawing,
              isDrawEnabled,
              startPos,
              color,
              lineWidth,
              contextRef,
              previewCanvasRef,
            )
          }
          onMouseUp={(e) =>
            stopDrawing(
              e,
              mode,
              isDrawing,
              startPos,
              color,
              lineWidth,
              setStartPos,
              setIsDrawing,
              contextRef,
              previewCanvasRef,
            )
          }
          onMouseOut={(e) =>
            stopDrawing(
              e,
              mode,
              isDrawing,
              startPos,
              color,
              lineWidth,
              setStartPos,
              setIsDrawing,
              contextRef,
              previewCanvasRef,
            )
          }
        />
        <canvas
          ref={previewCanvasRef}
          className="pointer-events-none absolute h-full w-full self-center"
        />
      </div>
    </main>
  );
}
