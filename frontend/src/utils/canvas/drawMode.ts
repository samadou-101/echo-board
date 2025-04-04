import { Canvas, PencilBrush } from "fabric";

export const setupDrawMode = (
  canvas: Canvas,
  color: string,
  lineWidth: number,
) => {
  // First set drawing mode to true to initialize the brush
  canvas.isDrawingMode = true;

  // If the brush doesn't exist yet, create it
  if (!canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush = new PencilBrush(canvas);
  }

  // Now it's safe to set the properties
  canvas.freeDrawingBrush.color = color;
  canvas.freeDrawingBrush.width = lineWidth;

  canvas.selection = false;
  canvas.defaultCursor = "crosshair";
};

export const disableDrawMode = (canvas: Canvas) => {
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.defaultCursor = "default";
};
