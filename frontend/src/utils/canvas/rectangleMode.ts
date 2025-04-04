import { MouseEvent } from "react";
import socket from "@services/socket/socket";
import { DrawingData } from "./canvas-utils";

export const rectangleModeStart = (
  e: MouseEvent<HTMLCanvasElement>,
  setStartPos: (pos: { x: number; y: number } | null) => void,
  setIsDrawing: (drawing: boolean) => void,
) => {
  const { offsetX, offsetY } = e.nativeEvent;
  setStartPos({ x: offsetX, y: offsetY });
  setIsDrawing(true);
};

export const rectangleModeMove = (
  e: MouseEvent<HTMLCanvasElement>,
  isDrawing: boolean,
  startPos: { x: number; y: number } | null,
  color: string,
  lineWidth: number,
  previewCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
) => {
  if (!isDrawing || !previewCanvasRef.current || !startPos) return;
  const { offsetX, offsetY } = e.nativeEvent;
  const previewContext = previewCanvasRef.current.getContext("2d");
  if (!previewContext) return;

  previewContext.clearRect(
    0,
    0,
    previewCanvasRef.current.width,
    previewCanvasRef.current.height,
  );
  previewContext.beginPath();
  previewContext.strokeStyle = color;
  previewContext.lineWidth = lineWidth;

  previewContext.rect(
    startPos.x,
    startPos.y,
    offsetX - startPos.x,
    offsetY - startPos.y,
  );
  previewContext.stroke();
};

export const rectangleModeStop = (
  e: MouseEvent<HTMLCanvasElement>,
  isDrawing: boolean,
  startPos: { x: number; y: number } | null,
  color: string,
  lineWidth: number,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  previewCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  roomId: string | null,
  userId: string | null,
  setStartPos: (pos: { x: number; y: number } | null) => void,
  setIsDrawing: (drawing: boolean) => void,
) => {
  if (
    !isDrawing ||
    !contextRef.current ||
    !previewCanvasRef.current ||
    !startPos
  )
    return;
  const { offsetX, offsetY } = e.nativeEvent;
  const previewContext = previewCanvasRef.current.getContext("2d");
  if (!previewContext) return;

  contextRef.current.beginPath();
  contextRef.current.strokeStyle = color;
  contextRef.current.lineWidth = lineWidth;
  contextRef.current.rect(
    startPos.x,
    startPos.y,
    offsetX - startPos.x,
    offsetY - startPos.y,
  );
  contextRef.current.stroke();

  if (roomId && userId) {
    const drawingData: DrawingData = {
      type: "rectangle",
      points: [startPos, { x: offsetX, y: offsetY }],
      color,
      lineWidth,
      userId,
    };
    socket.emit("draw-shape", { roomId, drawingData });
  }

  previewContext.clearRect(
    0,
    0,
    previewCanvasRef.current.width,
    previewCanvasRef.current.height,
  );
  setStartPos(null);
  setIsDrawing(false);
};
