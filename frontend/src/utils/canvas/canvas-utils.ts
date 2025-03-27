// @utils/canvas-utils.ts
import { MouseEvent } from "react";

export const startDrawing = (
  e: MouseEvent<HTMLCanvasElement>,
  mode: "draw" | "erase" | "circle" | "rectangle" | "triangle" | "rhombus",
  isDrawEnabled: boolean,
  setStartPos: (pos: { x: number; y: number } | null) => void,
  setIsDrawing: (drawing: boolean) => void,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
) => {
  const { offsetX, offsetY } = e.nativeEvent;
  if (
    mode === "circle" ||
    mode === "rectangle" ||
    mode === "triangle" ||
    mode === "rhombus"
  ) {
    setStartPos({ x: offsetX, y: offsetY });
    setIsDrawing(true);
  } else if (isDrawEnabled) {
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  }
};

export const draw = (
  e: MouseEvent<HTMLCanvasElement>,
  mode: "draw" | "erase" | "circle" | "rectangle" | "triangle" | "rhombus",
  isDrawing: boolean,
  isDrawEnabled: boolean,
  startPos: { x: number; y: number } | null,
  color: string,
  lineWidth: number,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  previewCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
) => {
  if (!isDrawing || !contextRef.current || !previewCanvasRef.current) return;
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

  if (mode === "circle" && startPos) {
    const radius = Math.sqrt(
      (offsetX - startPos.x) ** 2 + (offsetY - startPos.y) ** 2,
    );
    previewContext.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
  } else if (mode === "rectangle" && startPos) {
    previewContext.rect(
      startPos.x,
      startPos.y,
      offsetX - startPos.x,
      offsetY - startPos.y,
    );
  } else if (mode === "triangle" && startPos) {
    previewContext.moveTo(startPos.x, startPos.y);
    previewContext.lineTo(offsetX, offsetY);
    previewContext.lineTo(startPos.x - (offsetX - startPos.x), offsetY);
    previewContext.closePath();
  } else if (mode === "rhombus" && startPos) {
    const midX = (startPos.x + offsetX) / 2;
    const midY = (startPos.y + offsetY) / 2;
    previewContext.moveTo(midX, startPos.y);
    previewContext.lineTo(offsetX, midY);
    previewContext.lineTo(midX, offsetY);
    previewContext.lineTo(startPos.x, midY);
    previewContext.closePath();
  } else if (isDrawEnabled) {
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.strokeStyle = mode === "erase" ? "#d1d5db" : color;
    contextRef.current.lineWidth = mode === "erase" ? 20 : lineWidth;
    contextRef.current.stroke();
    return;
  }
  previewContext.stroke();
};

export const stopDrawing = (
  e: MouseEvent<HTMLCanvasElement>,
  mode: "draw" | "erase" | "circle" | "rectangle" | "triangle" | "rhombus",
  isDrawing: boolean,
  startPos: { x: number; y: number } | null,
  color: string,
  lineWidth: number,
  setStartPos: (pos: { x: number; y: number } | null) => void,
  setIsDrawing: (drawing: boolean) => void,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  previewCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
) => {
  if (!contextRef.current || !previewCanvasRef.current || !isDrawing) return;
  const previewContext = previewCanvasRef.current.getContext("2d");
  if (!previewContext) return;

  const { offsetX, offsetY } = e.nativeEvent;
  contextRef.current.beginPath();
  contextRef.current.strokeStyle = color;
  contextRef.current.lineWidth = lineWidth;

  if (mode === "circle" && startPos) {
    const radius = Math.sqrt(
      (offsetX - startPos.x) ** 2 + (offsetY - startPos.y) ** 2,
    );
    contextRef.current.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
  } else if (mode === "rectangle" && startPos) {
    contextRef.current.rect(
      startPos.x,
      startPos.y,
      offsetX - startPos.x,
      offsetY - startPos.y,
    );
  } else if (mode === "triangle" && startPos) {
    contextRef.current.moveTo(startPos.x, startPos.y);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.lineTo(startPos.x - (offsetX - startPos.x), offsetY);
    contextRef.current.closePath();
  } else if (mode === "rhombus" && startPos) {
    const midX = (startPos.x + offsetX) / 2;
    const midY = (startPos.y + offsetY) / 2;
    contextRef.current.moveTo(midX, startPos.y);
    contextRef.current.lineTo(offsetX, midY);
    contextRef.current.lineTo(midX, offsetY);
    contextRef.current.lineTo(startPos.x, midY);
    contextRef.current.closePath();
  }
  contextRef.current.stroke();
  previewContext.clearRect(
    0,
    0,
    previewCanvasRef.current.width,
    previewCanvasRef.current.height,
  );
  setStartPos(null);
  contextRef.current.closePath();
  setIsDrawing(false);
};

export const clearCanvas = (
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  previewCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
) => {
  if (canvasRef.current && contextRef.current && previewCanvasRef.current) {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
    const previewContext = previewCanvasRef.current.getContext("2d");
    if (previewContext)
      previewContext.clearRect(
        0,
        0,
        previewCanvasRef.current.width,
        previewCanvasRef.current.height,
      );
  }
};

export const initializeCanvas = (
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  previewCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
) => {
  const canvas = canvasRef.current;
  const previewCanvas = previewCanvasRef.current;
  if (!canvas || !previewCanvas) return;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  previewCanvas.width = canvas.offsetWidth;
  previewCanvas.height = canvas.offsetHeight;

  const context = canvas.getContext("2d");
  const previewContext = previewCanvas.getContext("2d");
  if (context && previewContext) {
    context.lineCap = "round";
    previewContext.lineCap = "round";
    contextRef.current = context;
  }
};
