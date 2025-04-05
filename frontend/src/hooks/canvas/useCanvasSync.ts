/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import {
  ActiveSelection,
  Canvas,
  FabricObject,
  FabricObjectProps,
  ObjectEvents,
  SerializedObjectProps,
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

    // Ensure each object has a unique ID
    const ensureObjectIds = () => {
      canvas.forEachObject((obj) => {
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

      isReceivingUpdate.current = true;

      try {
        // Save current canvas state that should be preserved
        const currentDrawingMode = canvas.isDrawingMode;
        const currentSelection = canvas.selection;
        const currentZoom = canvas.getZoom();
        const currentViewport = canvas.viewportTransform;

        // Save the currently selected objects to restore after load
        const activeObjects = canvas.getActiveObjects();
        const activeObjectIds = activeObjects.map((obj) => obj.id || "");

        // Check if selection was active before updating
        const hadActiveSelection = activeObjects.length > 0;

        canvas.loadFromJSON(data.json, () => {
          // Restore canvas state
          canvas.isDrawingMode = currentDrawingMode;
          canvas.selection = currentSelection;

          if (currentViewport) {
            canvas.setViewportTransform(currentViewport);
          }

          canvas.setZoom(currentZoom);

          // Re-select any previously selected objects by ID
          if (activeObjectIds.length > 0 && hadActiveSelection) {
            const objectsToSelect:
              | FabricObject<
                  Partial<FabricObjectProps>,
                  SerializedObjectProps,
                  ObjectEvents
                >[]
              | undefined = [];
            canvas.forEachObject((obj) => {
              if (obj.id && activeObjectIds.includes(obj.id)) {
                objectsToSelect.push(obj);
              }
            });

            if (objectsToSelect.length > 0) {
              if (objectsToSelect.length === 1) {
                canvas.setActiveObject(objectsToSelect[0]);
              } else {
                // Create active selection with the objects
                const activeSelection = new ActiveSelection(objectsToSelect, {
                  canvas,
                });
                canvas.setActiveObject(activeSelection);
              }
            }
          }

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
        emitCanvasChangeWithIds();
      }
    };

    // Handle canvas clear operations from other users
    const handleCanvasClear = (data: { roomId: string }) => {
      if (data.roomId === roomId) {
        isReceivingUpdate.current = true;
        canvas.clear();
        canvas.backgroundColor = "#f3f4f6";
        canvas.renderAll();

        setTimeout(() => {
          isReceivingUpdate.current = false;
        }, 50);
      }
    };

    // Set up socket listeners
    socket.off("canvas:update");
    socket.on("canvas:update", handleCanvasUpdate);

    socket.off("canvas:update-request");
    socket.on("canvas:update-request", handleUpdateRequest);

    socket.off("canvas:clear");
    socket.on("canvas:clear", handleCanvasClear);

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
      socket.off("canvas:clear");

      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [canvas, roomId]);
}
