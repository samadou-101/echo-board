import { MouseEvent } from "react";
import socket from "@services/socket/socket";
import { DrawingData } from "./canvas-utils";

export const eraseModeStart = (
  e: MouseEvent<HTMLCanvasElement>,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  roomId: string | null,
  userId: string | null,
  setIsDrawing: (drawing: boolean) => void,
) => {
  const { offsetX, offsetY } = e.nativeEvent;
  if (!contextRef.current) return;

  contextRef.current.beginPath();
  contextRef.current.moveTo(offsetX, offsetY);
  contextRef.current.strokeStyle = "#d1d5db";
  contextRef.current.lineWidth = 20;
  setIsDrawing(true);

  if (roomId && userId) {
    const drawingData: DrawingData = {
      type: "erase",
      points: [{ x: offsetX, y: offsetY }],
      color: "#d1d5db",
      lineWidth: 20,
      userId,
    };
    socket.emit("draw-start", { roomId, drawingData });
  }
};

export const eraseModeMove = (
  e: MouseEvent<HTMLCanvasElement>,
  isDrawing: boolean,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  roomId: string | null,
  userId: string | null,
) => {
  if (!isDrawing || !contextRef.current) return;
  const { offsetX, offsetY } = e.nativeEvent;

  contextRef.current.lineTo(offsetX, offsetY);
  contextRef.current.stroke();

  if (roomId && userId) {
    socket.emit("draw-move", {
      roomId,
      point: { x: offsetX, y: offsetY },
      userId,
      color: "#d1d5db",
      lineWidth: 20,
    });
  }
};

export const eraseModeStop = (
  isDrawing: boolean,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  roomId: string | null,
  userId: string | null,
  setIsDrawing: (drawing: boolean) => void,
) => {
  if (!isDrawing || !contextRef.current) return;

  contextRef.current.closePath();
  if (roomId && userId) {
    socket.emit("draw-end", { roomId, userId });
  }
  setIsDrawing(false);
};
