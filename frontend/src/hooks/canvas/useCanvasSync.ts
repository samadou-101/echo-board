/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import {
  // ActiveSelection,
  Canvas,
  // FabricObject,
  // FabricObjectProps,
  // ObjectEvents,
  // SerializedObjectProps,
} from "fabric";

interface UseCanvasSyncArgs {
  canvas: Canvas | null;
  roomId: string | null;
  socket: any;
  isReceivingUpdate: React.RefObject<boolean>;
  mouseDownRef: React.RefObject<boolean>;
  lastObjectRef: React.RefObject<any>;
  throttleTimeoutRef: React.RefObject<any>;
}

export function useCanvasSync({
  canvas,
  roomId,
  socket,
  isReceivingUpdate,
  mouseDownRef,
  lastObjectRef,
  throttleTimeoutRef,
}: UseCanvasSyncArgs) {
  useEffect(() => {
    if (!canvas || !roomId) return;

    console.log("Canvas sync hook initialized for room:", roomId);

    // Ensure each object has a unique ID
    const ensureObjectIds = () => {
      canvas.getObjects().forEach((obj) => {
        if (!obj.id) {
          obj.id = `obj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        }
      });
    };

    // Function to emit canvas changes with object IDs
    const emitCanvasChangeWithIds = () => {
      if (isReceivingUpdate.current) return;

      ensureObjectIds();
      const json = canvas.toJSON(["id"]);
      console.log("Emitting canvas update for room:", roomId);
      socket.emit("canvas:update", { roomId, json });
    };

    // Function to throttle updates during continuous drawing/moving
    const throttledEmitChange = () => {
      if (isReceivingUpdate.current) return;

      if (!throttleTimeoutRef.current) {
        // Emit immediately for the first update in a sequence
        emitCanvasChangeWithIds();

        // Set throttle for subsequent updates
        throttleTimeoutRef.current = setTimeout(() => {
          throttleTimeoutRef.current = null;
          // If still in active drawing/moving, emit again
          if (mouseDownRef.current) {
            emitCanvasChangeWithIds();
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
        emitCanvasChangeWithIds();
      }
    };

    // Add ID to new objects
    const handleObjectAdded = (e: any) => {
      if (e.target && !e.target.id) {
        e.target.id = `obj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      }
      lastObjectRef.current = e.target;
      throttledEmitChange();
    };

    const handleObjectModified = () => {
      throttledEmitChange();
    };

    const handlePathCreated = (e: any) => {
      if (e.path && !e.path.id) {
        e.path.id = `path_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      }
      throttledEmitChange();
    };

    // Real-time drawing update during path creation
    const handleObjectMoving = () => {
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
      console.log("Received canvas update");

      isReceivingUpdate.current = true;

      try {
        // Save current canvas state that should be preserved
        const currentDrawingMode = canvas.isDrawingMode;
        const currentZoom = canvas.getZoom();
        const currentViewport = canvas.viewportTransform;

        // Load the JSON into the canvas
        canvas.loadFromJSON(data.json, () => {
          // Restore canvas state
          canvas.isDrawingMode = currentDrawingMode;

          if (currentViewport) {
            canvas.setViewportTransform(currentViewport);
          }

          canvas.setZoom(currentZoom);

          // Force a full re-render and update
          canvas.renderAll();

          // Important: Force browser to render the canvas
          // This helps with making sure changes are visible
          canvas.fire("after:render");

          console.log("Canvas updated successfully");

          // Reset the receiving flag after a short delay
          setTimeout(() => {
            isReceivingUpdate.current = false;

            // Add a second renderAll() after the flag is reset
            // This ensures any queued updates are properly displayed

            canvas.renderAll();
          }, 50);
        });
      } catch (error) {
        console.error("Failed to process canvas update:", error);
        isReceivingUpdate.current = false;
      }
    };

    // Request initial canvas state when joining room
    const requestInitialCanvas = () => {
      console.log("Requesting initial canvas state for room:", roomId);
      socket.emit("canvas:request-initial", { roomId });
    };

    // Handle requests for canvas updates from new users
    const handleInitialRequest = (data: { roomId: string; userId: string }) => {
      if (data.roomId !== roomId) return;

      console.log(
        "Received request for initial canvas state from user:",
        data.userId,
      );

      // Only respond if we have content on the canvas and we're not currently receiving updates
      if (!isReceivingUpdate.current && canvas.getObjects().length > 0) {
        console.log("Sending initial canvas state");
        emitCanvasChangeWithIds();
      } else {
        console.log("No canvas content to send or currently receiving updates");
      }
    };

    // Handle canvas clear operations from other users
    const handleCanvasClear = (data: { roomId: string }) => {
      if (data.roomId !== roomId) return;

      console.log("Received canvas clear request");
      isReceivingUpdate.current = true;
      canvas.clear();
      canvas.renderAll();

      setTimeout(() => {
        isReceivingUpdate.current = false;
      }, 50);
    };

    // Setup periodic rendering to ensure changes are visible
    const renderInterval = setInterval(() => {
      if (canvas && !isReceivingUpdate.current) {
        canvas.renderAll();
      }
    }, 1000); // Render every second as a backup

    // Set up socket listeners
    socket.off("canvas:update");
    socket.on("canvas:update", handleCanvasUpdate);

    socket.off("canvas:request-initial");
    socket.on("canvas:request-initial", handleInitialRequest);

    socket.off("canvas:clear");
    socket.on("canvas:clear", handleCanvasClear);

    // When joining a room, wait a moment then request the initial canvas state
    setTimeout(() => {
      requestInitialCanvas();
    }, 500); // Small delay to ensure room joining is complete

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
      socket.off("canvas:request-initial");
      socket.off("canvas:clear");

      clearInterval(renderInterval);

      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [canvas, roomId]);
}
