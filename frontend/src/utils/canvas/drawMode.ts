// import { Canvas } from "fabric";

export const setupDrawMode = (
  canvas: fabric.Canvas,
  color: string,
  lineWidth: number,
) => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = color;
  canvas.freeDrawingBrush.width = lineWidth;
  canvas.selection = false;
  canvas.defaultCursor = "crosshair";
};

export const disableDrawMode = (canvas: fabric.Canvas) => {
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.defaultCursor = "default";
};
