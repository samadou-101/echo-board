import socket from "@services/socket/socket";

export interface DrawingData {
  type: "draw" | "erase" | "circle" | "rectangle" | "triangle" | "rhombus";
  points: { x: number; y: number }[];
  color: string;
  lineWidth: number;
  userId?: string | null;
}

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
