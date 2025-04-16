import { useEffect } from "react";
import { Canvas } from "fabric";
import socket from "@services/socket/socket";

export const useRoomInitialization = (
  canvas: Canvas | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  roomId: string | null,
  isCanvasReady: boolean,
) => {
  useEffect(() => {
    if (roomId && isCanvasReady && canvas && canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        if (width > 0 && height > 0) {
          canvas.setDimensions({ width, height });
        }
      }
      canvas.renderAll();
      socket.emit("canvas:request-update", { roomId });
      console.log("Canvas initialized in room:", roomId);
    }
  }, [canvas, canvasRef, roomId, isCanvasReady]);
};
