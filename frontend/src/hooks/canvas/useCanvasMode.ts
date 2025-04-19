/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Canvas, IText } from "fabric";
import { disableDrawMode, setupDrawMode } from "@utils/canvas/drawMode";
import { disableEraseMode, setupEraseMode } from "@utils/canvas/eraseMode";
import { rectangleModeStart } from "@utils/canvas/rectangleMode";
import { circleModeStart } from "@utils/canvas/circleMode";
import { triangleModeStart } from "@utils/canvas/triangleMode";
import { rhombusModeStart } from "@utils/canvas/rhombusMode";
import { setupTextMode } from "@utils/canvas/textMode";

interface UseCanvasModeArgs {
  canvas: Canvas | null;
  mode: string;
  color: string;
  lineWidth: number;
}

const disableTextMode = (canvas: Canvas) => {
  canvas.off("mouse:down");
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.defaultCursor = "default";
};

const ensureTextOnTop = (canvas: Canvas) => {
  const objects = canvas.getObjects();
  const textObjects = objects.filter((obj) => obj instanceof IText);
  textObjects.forEach((text) => canvas.bringObjectToFront(text));
};

const setupShapeMode = (
  canvas: Canvas,
  shapeStartFn: (canvas: Canvas) => void,
) => {
  shapeStartFn(canvas);
  ensureTextOnTop(canvas);
};

export const useCanvasMode = ({
  canvas,
  mode,
  color,
  lineWidth,
}: UseCanvasModeArgs) => {
  useEffect(() => {
    if (!canvas) return;

    disableDrawMode(canvas);
    disableEraseMode(canvas);
    disableTextMode(canvas);

    switch (mode) {
      case "draw":
        setupDrawMode(canvas, color, lineWidth);
        ensureTextOnTop(canvas);
        break;
      case "erase":
        setupEraseMode(canvas);
        ensureTextOnTop(canvas);
        break;
      case "rectangle":
        setupShapeMode(canvas, rectangleModeStart);
        break;
      case "circle":
        setupShapeMode(canvas, circleModeStart);
        break;
      case "triangle":
        setupShapeMode(canvas, triangleModeStart);
        break;
      case "rhombus":
        setupShapeMode(canvas, rhombusModeStart);
        break;
      case "text":
        setupTextMode(canvas);
        break;
      case "select":
        canvas.selection = true;
        canvas.defaultCursor = "default";
        canvas.isDrawingMode = false;
        ensureTextOnTop(canvas);
        break;
      case "pan":
        canvas.selection = false;
        canvas.defaultCursor = "grab";
        canvas.isDrawingMode = false;
        ensureTextOnTop(canvas);
        break;
      default:
        console.warn(`Unknown mode: ${mode}`);
        canvas.selection = true;
        canvas.defaultCursor = "default";
        canvas.isDrawingMode = false;
        ensureTextOnTop(canvas);
    }

    canvas.renderAll();

    // Return cleanup function
    return () => {
      disableDrawMode(canvas);
      disableEraseMode(canvas);
      disableTextMode(canvas);
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.defaultCursor = "default";
      canvas.renderAll();
    };
  }, [mode, canvas, color, lineWidth]);
};
