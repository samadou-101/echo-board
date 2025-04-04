import { MouseEvent } from "react";
import socket from "@services/socket/socket";
import { DrawingData } from "./canvas-utils";

export const rhombusModeStart = (
  e: MouseEvent<HTMLCanvasElement>,
  setStartPos: (pos: { x: number; y: number } | null) => void,
  setIsDrawing: (drawing: boolean) => void,
) => {
  const { offsetX, offsetY } = e.nativeEvent;
  setStartPos({ x: offsetX, y: offsetY });
  setIsDrawing(true);
};

export const rhombusModeMove = (
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

  const midX = (startPos.x + offsetX) / 2;
  const midY = (startPos.y + offsetY) / 2;
  previewContext.moveTo(midX, startPos.y);
  previewContext.lineTo(offsetX, midY);
  previewContext.lineTo(midX, offsetY);
  previewContext.lineTo(startPos.x, midY);
  previewContext.closePath();
  previewContext.stroke();
};

export const rhombusModeStop = (
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
  const midX = (startPos.x + offsetX) / 2;
  const midY = (startPos.y + offsetY) / 2;
  contextRef.current.moveTo(midX, startPos.y);
  contextRef.current.lineTo(offsetX, midY);
  contextRef.current.lineTo(midX, offsetY);
  contextRef.current.lineTo(startPos.x, midY);
  contextRef.current.closePath();
  contextRef.current.stroke();

  if (roomId && userId) {
    const drawingData: DrawingData = {
      type: "rhombus",
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
