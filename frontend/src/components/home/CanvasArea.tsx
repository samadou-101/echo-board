import { useEffect, useRef, useState } from "react";
import Button from "@components/ui/Button";
import * as Tabs from "@radix-ui/react-tabs";
import { Canvas } from "fabric";
import { rectangleModeStart } from "@utils/canvas/rectangleMode";
import { circleModeStart } from "@utils/canvas/circleMode";
import { rhombusModeStart } from "@utils/canvas/rhombusMode";
import { triangleModeStart } from "@utils/canvas/triangleMode";
import { setupDrawMode, disableDrawMode } from "@utils/canvas/drawMode";
import { setupEraseMode, disableEraseMode } from "@utils/canvas/eraseMode";
import { emitCanvasChange } from "@services/socket/socket-services";
import { useAppSelector } from "@hooks/redux/redux-hooks";
import socket from "@services/socket/socket";

export default function CanvasArea() {
  const [mode, setMode] = useState<
    | "select"
    | "draw"
    | "erase"
    | "circle"
    | "rectangle"
    | "triangle"
    | "rhombus"
  >("select");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [lineWidth, setLineWidth] = useState<number>(2);
  const [color, setColor] = useState<string>("#000000");
  const roomId = useAppSelector((state) => state.global.roomId);
  const isReceivingUpdate = useRef(false);
  const mouseDownRef = useRef(false);
  const lastObjectRef = useRef<any>(null);
  const throttleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  // Initial canvas setup
  useEffect(() => {
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();

        const initCanvas = new Canvas(canvasRef.current, {
          width,
          height,
          isDrawingMode: false,
          selection: true,
          preserveObjectStacking: true,
        });

        initCanvas.backgroundColor = "#f3f4f6";
        initCanvas.renderAll();
        setCanvas(initCanvas);

        // Force another render after a slight delay to ensure DOM is ready
        setTimeout(() => {
          initCanvas.renderAll();
          setIsCanvasReady(true);
        }, 100);

        const handleResize = () => {
          const { width, height } = container.getBoundingClientRect();
          initCanvas.setWidth(width);
          initCanvas.setHeight(height);
          initCanvas.renderAll();
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          initCanvas.dispose();
        };
      }
    }
  }, []);

  // Ensure canvas dimensions are correct after all components mount
  useEffect(() => {
    if (canvas && canvasRef.current && isCanvasReady) {
      const container = canvasRef.current.parentElement;
      if (container) {
        // Force resize after component is fully mounted
        const { width, height } = container.getBoundingClientRect();

        if (width > 0 && height > 0) {
          canvas.setWidth(width);
          canvas.setHeight(height);
          canvas.renderAll();
        }
      }
    }
  }, [canvas, isCanvasReady]);

  // Effect to handle mode changes
  useEffect(() => {
    if (!canvas) return;

    // First, clean up any active modes
    disableDrawMode(canvas);
    disableEraseMode(canvas);

    // Apply the new mode
    if (mode === "draw") {
      setupDrawMode(canvas, color, lineWidth);
    } else if (mode === "erase") {
      setupEraseMode(canvas);
    } else if (mode === "rectangle") {
      rectangleModeStart(canvas);
    } else if (mode === "circle") {
      circleModeStart(canvas);
    } else if (mode === "triangle") {
      triangleModeStart(canvas);
    } else if (mode === "rhombus") {
      rhombusModeStart(canvas);
    } else if (mode === "select") {
      canvas.selection = true;
      canvas.defaultCursor = "default";
    }

    // Force render to ensure mode change takes effect immediately
    canvas.renderAll();
  }, [mode, canvas, color, lineWidth]);

  // Effect to handle room initialization
  useEffect(() => {
    if (canvas && roomId && isCanvasReady) {
      // Make sure the canvas is visible and properly sized
      if (canvasRef.current && canvasRef.current.parentElement) {
        const container = canvasRef.current.parentElement;
        const { width, height } = container.getBoundingClientRect();

        if (width > 0 && height > 0) {
          canvas.setWidth(width);
          canvas.setHeight(height);
        }
      }

      // Force a re-render
      canvas.renderAll();

      // Get the initial canvas state from the server
      socket.emit("canvas:request-update", { roomId });

      // Log success for debugging
      console.log("Canvas initialized in room:", roomId);
    }
  }, [canvas, roomId, isCanvasReady]);

  // Socket emitting and listening
  useEffect(() => {
    if (!canvas || !roomId) return;

    // Function to throttle updates during continuous drawing/moving
    const throttledEmitChange = () => {
      if (isReceivingUpdate.current) return;

      if (!throttleTimeoutRef.current) {
        // Emit immediately for the first update in a sequence
        emitCanvasChange(canvas, roomId);

        // Set throttle for subsequent updates
        throttleTimeoutRef.current = setTimeout(() => {
          throttleTimeoutRef.current = null;
          // If still in active drawing/moving, emit again
          if (mouseDownRef.current) {
            emitCanvasChange(canvas, roomId);
          }
        }, 30); // 30ms throttle for smoother updates
      }
    };

    // Track mouse down/up for throttling during active interaction
    const handleMouseDown = () => {
      mouseDownRef.current = true;
    };

    const handleMouseUp = () => {
      mouseDownRef.current = false;
      // Always emit on mouse up to ensure final state is synced
      if (!isReceivingUpdate.current) {
        emitCanvasChange(canvas, roomId);
      }
    };

    // Track object creation and modification for real-time updates
    const handleObjectAdded = (e: any) => {
      lastObjectRef.current = e.target;
      throttledEmitChange();
    };

    const handleObjectModified = (e: any) => {
      throttledEmitChange();
    };

    const handlePathCreated = (e: any) => {
      throttledEmitChange();
    };

    // Real-time drawing update during path creation
    const handleObjectMoving = (e: any) => {
      if (mouseDownRef.current) {
        throttledEmitChange();
      }
    };

    const handleDrawing = () => {
      if (canvas.isDrawingMode && mouseDownRef.current) {
        throttledEmitChange();
      }
    };

    // Clean up existing event listeners to prevent duplicates
    canvas.off("mouse:down", handleMouseDown);
    canvas.off("mouse:up", handleMouseUp);
    canvas.off("object:added", handleObjectAdded);
    canvas.off("object:modified", handleObjectModified);
    canvas.off("path:created", handlePathCreated);
    canvas.off("object:moving", handleObjectMoving);
    canvas.off("after:render", handleDrawing);

    // Attach the event listeners
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("object:added", handleObjectAdded);
    canvas.on("object:modified", handleObjectModified);
    canvas.on("path:created", handlePathCreated);
    canvas.on("object:moving", handleObjectMoving);
    canvas.on("after:render", handleDrawing);

    // Handle incoming canvas updates
    const handleCanvasUpdate = (data: { json: any }) => {
      if (!data.json) return;

      isReceivingUpdate.current = true;

      try {
        // Save current canvas state that should be preserved
        const currentDrawingMode = canvas.isDrawingMode;
        const currentSelection = canvas.selection;
        const currentZoom = canvas.getZoom();
        const currentViewport = canvas.viewportTransform;

        canvas.loadFromJSON(data.json, () => {
          // Restore canvas state
          canvas.isDrawingMode = currentDrawingMode;
          canvas.selection = currentSelection;

          if (currentViewport) {
            canvas.setViewportTransform(currentViewport);
          }

          canvas.setZoom(currentZoom);

          // Critical: force a full render
          canvas.requestRenderAll();

          // Reset the receiving flag after a short delay
          setTimeout(() => {
            isReceivingUpdate.current = false;
          }, 50);
        });
      } catch (error) {
        console.error("Failed to process canvas update:", error);
        isReceivingUpdate.current = false;
      }
    };

    // Handle requests for canvas updates from new users
    const handleUpdateRequest = (data: { roomId: string }) => {
      if (data.roomId === roomId && !isReceivingUpdate.current) {
        emitCanvasChange(canvas, roomId);
      }
    };

    // Set up socket listeners
    socket.off("canvas:update");
    socket.on("canvas:update", handleCanvasUpdate);

    socket.off("canvas:update-request");
    socket.on("canvas:update-request", handleUpdateRequest);

    return () => {
      // Clean up all event listeners
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:up", handleMouseUp);
      canvas.off("object:added", handleObjectAdded);
      canvas.off("object:modified", handleObjectModified);
      canvas.off("path:created", handlePathCreated);
      canvas.off("object:moving", handleObjectMoving);
      canvas.off("after:render", handleDrawing);

      socket.off("canvas:update");
      socket.off("canvas:update-request");

      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [canvas, roomId]);

  const handleModeChange = (
    newMode:
      | "select"
      | "draw"
      | "erase"
      | "circle"
      | "rectangle"
      | "triangle"
      | "rhombus",
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
      canvas.clear();
      canvas.backgroundColor = "#f3f4f6";
      canvas.renderAll();
      if (roomId) emitCanvasChange(canvas, roomId);
    }
  };

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
      <div className="absolute top-4 left-1/2 z-10 h-fit max-w-xs -translate-x-1/2 px-4 sm:max-w-md md:max-w-lg">
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
              className={`flex h-8 w-8 items-center justify-center shadow-sm ${mode === "select" ? "border-blue-500 bg-blue-100 dark:bg-blue-900" : ""}`}
              onClick={() => handleModeChange("select")}
            >
              ↖️
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
        <div className="relative h-full w-full border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          {/* Canvas wrapper with visual indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            {!isCanvasReady && (
              <p className="text-gray-500">Loading canvas...</p>
            )}
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
                      : "pointer",
            }}
          />
        </div>
      </div>
    </main>
  );
}
