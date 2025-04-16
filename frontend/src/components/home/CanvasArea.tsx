/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Button from "@components/ui/Button";
import * as Tabs from "@radix-ui/react-tabs";
import { Canvas } from "fabric";
import { setupDrawMode } from "@utils/canvas/drawMode";
// import { emitCanvasChange } from "@services/socket/socket-services";
import { useAppSelector } from "@hooks/redux/redux-hooks";
import socket from "@services/socket/socket";
import { useInitCanvas } from "@hooks/canvas/useInitCanvas";
import { useCanvasMode } from "@hooks/canvas/useCanvasMode";
import { useCanvasSync } from "@hooks/canvas/useCanvasSync";
import { Hand, Maximize, MousePointer2 } from "lucide-react";

export default function CanvasArea() {
  const [mode, setMode] = useState<
    | "select"
    | "draw"
    | "erase"
    | "circle"
    | "rectangle"
    | "triangle"
    | "rhombus"
    | "pan"
  >("select");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [color, setColor] = useState<string>("#000000");
  const roomId = useAppSelector((state) => state.global.roomId);
  const isReceivingUpdate = useRef(false);
  const mouseDownRef = useRef(false);
  const lastObjectRef = useRef<unknown>(null);
  const throttleTimeoutRef = useRef<number | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  // const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const lastPosX = useRef<number>(0);
  const lastPosY = useRef<number>(0);

  useInitCanvas({ setIsCanvasReady, canvasRef, setCanvas });

  // Ensure canvas dimensions are correct after all components mount
  useEffect(() => {
    if (canvas && canvasRef.current && isCanvasReady) {
      const container = canvasRef.current.parentElement;
      if (container) {
        // Force resize after component is fully mounted
        const { width, height } = container.getBoundingClientRect();

        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
          canvas.renderAll();
        }
      }
    }
  }, [canvas, isCanvasReady]);

  useCanvasMode({ canvas, mode, color, lineWidth });
  useEffect(() => {
    if (!canvas) return;

    // Handle canvas pan mode
    const handlePanMouseDown = (e: any) => {
      if (mode !== "pan") return;
      canvas.defaultCursor = "grabbing";
      canvas.renderAll();
      lastPosX.current = e.e.clientX;
      lastPosY.current = e.e.clientY;
    };

    const handlePanMouseMove = (e: any) => {
      if (mode !== "pan" || !lastPosX.current || !lastPosY.current) return;

      const vpt = canvas.viewportTransform;
      if (!vpt) return;

      const deltaX = e.e.clientX - lastPosX.current;
      const deltaY = e.e.clientY - lastPosY.current;

      vpt[4] += deltaX;
      vpt[5] += deltaY;

      canvas.setViewportTransform(vpt);
      canvas.requestRenderAll();

      lastPosX.current = e.e.clientX;
      lastPosY.current = e.e.clientY;
    };

    const handlePanMouseUp = () => {
      if (mode !== "pan") return;
      canvas.defaultCursor = "grab";
      canvas.renderAll();
      lastPosX.current = 0;
      lastPosY.current = 0;
    };

    // Pan events
    canvas.on("mouse:down", handlePanMouseDown);
    canvas.on("mouse:move", handlePanMouseMove);
    canvas.on("mouse:up", handlePanMouseUp);

    // Effect to handle room initialization (shared drawing logic)
    if (roomId && isCanvasReady) {
      // Ensure the canvas is properly sized
      if (canvasRef.current && canvasRef.current.parentElement) {
        const container = canvasRef.current.parentElement;
        const { width, height } = container.getBoundingClientRect();

        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
        }
      }

      // Force re-render after resizing
      canvas.renderAll();

      // Get the initial canvas state from the server
      socket.emit("canvas:request-update", { roomId });

      console.log("Canvas initialized in room:", roomId);
    }

    // Cleanup event listeners
    return () => {
      canvas.off("mouse:down", handlePanMouseDown);
      canvas.off("mouse:move", handlePanMouseMove);
      canvas.off("mouse:up", handlePanMouseUp);
    };
  }, [canvas, roomId, isCanvasReady, mode]);

  useCanvasSync({
    canvas,
    roomId,
    socket,
    isReceivingUpdate,
    mouseDownRef,
    lastObjectRef,
    throttleTimeoutRef,
  });

  const handleModeChange = (
    newMode:
      | "select"
      | "draw"
      | "erase"
      | "circle"
      | "rectangle"
      | "triangle"
      | "rhombus"
      | "pan",
  ) => {
    setMode(newMode);
  };

  const handleTabChange = (value: string) => {
    if (value === "select") {
      handleModeChange("select");
    } else if (value === "draw") {
      handleModeChange("draw");
    }
  };
  const handleClearCanvas = () => {
    if (canvas) {
      // Clear all objects but maintain canvas settings
      canvas.clear();
      canvas.backgroundColor = "#f3f4f6";
      canvas.renderAll();

      // Only emit to socket if inside a room
      if (roomId) {
        socket.emit("canvas:clear", { roomId });
      }
    }
  };

  // const handleClearCanvas = () => {
  //   if (canvas && roomId) {
  //     // Clear all objects but maintain canvas settings
  //     canvas.clear();
  //     canvas.backgroundColor = "#f3f4f6";
  //     canvas.renderAll();

  //     // Emit a specific clear event
  //     socket.emit("canvas:clear", { roomId });
  //   }
  // };

  const handleLineWidthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const width = parseInt(e.target.value);
    setLineWidth(width);

    if (mode === "draw" && canvas) {
      setupDrawMode(canvas, color, width);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);

    if (mode === "draw" && canvas) {
      setupDrawMode(canvas, newColor, lineWidth);
    }
  };

  return (
    <main className="relative flex h-[calc(100vh-4rem)] flex-1 flex-col pt-24 transition-colors duration-200 dark:bg-gray-900">
      <div className="fixed top-24 left-[55%] z-10 w-[30%] max-w-screen-lg -translate-x-1/2 transform px-4 max-2xl:w-[40%] max-xl:w-[45%] max-lg:left-[65%] max-lg:w-[60%] max-md:left-1/2 max-md:w-[80%]">
        <Tabs.Root
          defaultValue="select"
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
            value="select"
            className="mt-2 flex flex-wrap justify-center gap-2 rounded-lg border border-gray-200 bg-white/95 p-2 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95"
          >
            <Button
              variant="outline"
              size="icon"
              className={`flex h-9 w-9 items-center justify-center shadow-sm ${mode === "select" ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : ""}`}
              onClick={() => handleModeChange("select")}
            >
              <MousePointer2 />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`flex h-9 w-9 items-center justify-center shadow-sm ${mode === "pan" ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : ""}`}
              onClick={() => handleModeChange("pan")}
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
              value={lineWidth}
              onChange={handleLineWidthChange}
            >
              <option value="2">Thin (2px)</option>
              <option value="5">Medium (5px)</option>
              <option value="10">Thick (10px)</option>
            </select>
            <input
              type="color"
              className="h-8 w-8 rounded"
              value={color}
              onChange={handleColorChange}
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
              onClick={handleClearCanvas}
            >
              🗑️
            </Button>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      <div className="relative flex h-full w-full flex-col md:flex-row">
        {/* <div className="relative h-full w-full border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"> */}
        {/* Canvas wrapper with visual indicator */}
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
