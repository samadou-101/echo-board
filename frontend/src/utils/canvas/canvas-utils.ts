// @utils/canvas-utils.ts
import { MouseEvent } from "react";
import socket from "@services/socket/socket";

export interface DrawingData {
  type: "draw" | "erase" | "circle" | "rectangle" | "triangle" | "rhombus";
  points: { x: number; y: number }[];
  color: string;
  lineWidth: number;
  userId?: string | null;
}

export const startDrawing = (
  e: MouseEvent<HTMLCanvasElement>,
  mode: "draw" | "erase" | "circle" | "rectangle" | "triangle" | "rhombus",
  isDrawEnabled: boolean,
  setStartPos: (pos: { x: number; y: number } | null) => void,
  setIsDrawing: (drawing: boolean) => void,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  roomId: string | null,
  userId: string | null,
  color: string,
  lineWidth: number,
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
  } else if (isDrawEnabled && contextRef.current) {
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.strokeStyle = mode === "erase" ? "#d1d5db" : color;
    contextRef.current.lineWidth = mode === "erase" ? 20 : lineWidth;
    setIsDrawing(true);

    if (roomId && userId) {
      // if (roomId) {
      const drawingData: DrawingData = {
        type: mode,
        points: [{ x: offsetX, y: offsetY }],
        color: mode === "erase" ? "#d1d5db" : color,
        lineWidth: mode === "erase" ? 20 : lineWidth,
        userId,
      };
      socket.emit("draw-start", { roomId, drawingData });
      console.log("emitted draw");
      console.log("roomId + userId" + roomId + " " + userId);
    }
    console.log("outside roomId " + roomId + " userId " + userId);
    // console.log("emitted draw");
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
  roomId: string | null,
  userId: string | null,
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

  if (isDrawEnabled && (mode === "draw" || mode === "erase")) {
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    if (roomId && userId) {
      socket.emit("draw-move", {
        roomId,
        point: { x: offsetX, y: offsetY },
        userId,
        color: mode === "erase" ? "#d1d5db" : color,
        lineWidth: mode === "erase" ? 20 : lineWidth,
      });
    }
    return;
  }

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
  roomId: string | null,
  userId: string | null,
) => {
  if (!isDrawing || !contextRef.current || !previewCanvasRef.current) return;
  const previewContext = previewCanvasRef.current.getContext("2d");
  if (!previewContext) return;

  const { offsetX, offsetY } = e.nativeEvent;

  if ((mode === "draw" || mode === "erase") && roomId && userId) {
    contextRef.current.closePath();
    socket.emit("draw-end", { roomId, userId });
  } else if (
    startPos &&
    (mode === "circle" ||
      mode === "rectangle" ||
      mode === "triangle" ||
      mode === "rhombus")
  ) {
    const drawingData: DrawingData = {
      type: mode,
      points: [startPos, { x: offsetX, y: offsetY }],
      color,
      lineWidth,
      userId,
    };
    // Draw the shape on the main canvas locally
    contextRef.current.beginPath();
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = lineWidth;
    if (mode === "circle") {
      const radius = Math.sqrt(
        (offsetX - startPos.x) ** 2 + (offsetY - startPos.y) ** 2,
      );
      contextRef.current.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
    } else if (mode === "rectangle") {
      contextRef.current.rect(
        startPos.x,
        startPos.y,
        offsetX - startPos.x,
        offsetY - startPos.y,
      );
    } else if (mode === "triangle") {
      contextRef.current.moveTo(startPos.x, startPos.y);
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.lineTo(startPos.x - (offsetX - startPos.x), offsetY);
      contextRef.current.closePath();
    } else if (mode === "rhombus") {
      const midX = (startPos.x + offsetX) / 2;
      const midY = (startPos.y + offsetY) / 2;
      contextRef.current.moveTo(midX, startPos.y);
      contextRef.current.lineTo(offsetX, midY);
      contextRef.current.lineTo(midX, offsetY);
      contextRef.current.lineTo(startPos.x, midY);
      contextRef.current.closePath();
    }
    contextRef.current.stroke();

    if (roomId && userId) {
      socket.emit("draw-shape", { roomId, drawingData });
    }
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

export const clearCanvas = (
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  contextRef: React.MutableRefObject<CanvasRenderingContext2D | null>,
  previewCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  roomId: string | null,
  userId: string | null,
) => {
  if (canvasRef.current && contextRef.current && previewCanvasRef.current) {
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
    const previewContext = previewCanvasRef.current.getContext("2d");
    if (previewContext) {
      previewContext.clearRect(
        0,
        0,
        previewCanvasRef.current.width,
        previewCanvasRef.current.height,
      );
    }

    // if (roomId && userId) {
    if (roomId && userId) {
      socket.emit("clear-canvas", { roomId, userId });
    }
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
    context.lineJoin = "round";
    previewContext.lineCap = "round";
    previewContext.lineJoin = "round";
    contextRef.current = context;
  }
};

export const applyRemoteDrawing = (
  drawingData: DrawingData,
  context: CanvasRenderingContext2D,
) => {
  const { type, points, color, lineWidth } = drawingData;
  context.save();
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();

  if (type === "draw" || type === "erase") {
    if (points.length > 0) {
      context.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
      }
      context.stroke();
    }
  } else if (type === "circle" && points.length === 2) {
    const radius = Math.sqrt(
      (points[1].x - points[0].x) ** 2 + (points[1].y - points[0].y) ** 2,
    );
    context.arc(points[0].x, points[0].y, radius, 0, 2 * Math.PI);
    context.stroke();
  } else if (type === "rectangle" && points.length === 2) {
    context.rect(
      points[0].x,
      points[0].y,
      points[1].x - points[0].x,
      points[1].y - points[0].y,
    );
    context.stroke();
  } else if (type === "triangle" && points.length === 2) {
    context.moveTo(points[0].x, points[0].y);
    context.lineTo(points[1].x, points[1].y);
    context.lineTo(points[0].x - (points[1].x - points[0].x), points[1].y);
    context.closePath();
    context.stroke();
  } else if (type === "rhombus" && points.length === 2) {
    const midX = (points[0].x + points[1].x) / 2;
    const midY = (points[0].y + points[1].y) / 2;
    context.moveTo(midX, points[0].y);
    context.lineTo(points[1].x, midY);
    context.lineTo(midX, points[1].y);
    context.lineTo(points[0].x, midY);
    context.closePath();
    context.stroke();
  }

  context.restore();
};
