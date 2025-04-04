import { MouseEvent } from "react";
import socket from "@services/socket/socket";
import { DrawingData } from "./canvas-utils";

export const drawModeStart = (
  e: MouseEvent<HTMLCanvasElement>,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  roomId: string | null,
  userId: string | null,
  color: string,
  lineWidth: number,
  setIsDrawing: (drawing: boolean) => void,
) => {
  const { offsetX, offsetY } = e.nativeEvent;
  if (!contextRef.current) return;

  contextRef.current.beginPath();
  contextRef.current.moveTo(offsetX, offsetY);
  contextRef.current.strokeStyle = color;
  contextRef.current.lineWidth = lineWidth;
  setIsDrawing(true);

  if (roomId && userId) {
    const drawingData: DrawingData = {
      type: "draw",
      points: [{ x: offsetX, y: offsetY }],
      color,
      lineWidth,
      userId,
    };
    socket.emit("draw-start", { roomId, drawingData });
  }
};

export const drawModeMove = (
  e: MouseEvent<HTMLCanvasElement>,
  isDrawing: boolean,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  roomId: string | null,
  userId: string | null,
  color: string,
  lineWidth: number,
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
      color,
      lineWidth,
    });
  }
};

export const drawModeStop = (
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
