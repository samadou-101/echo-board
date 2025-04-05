import { useEffect } from "react";
import type { Canvas } from "fabric";
import { disableDrawMode, setupDrawMode } from "@utils/canvas/drawMode";
import { disableEraseMode, setupEraseMode } from "@utils/canvas/eraseMode";
import { rectangleModeStart } from "@utils/canvas/rectangleMode";
import { circleModeStart } from "@utils/canvas/circleMode";
import { triangleModeStart } from "@utils/canvas/triangleMode";
import { rhombusModeStart } from "@utils/canvas/rhombusMode";

interface UseCanvasModeArgs {
  canvas: Canvas | null;
  mode: string;
  color: string;
  lineWidth: number;
}

export const useCanvasMode = ({
  canvas,
  mode,
  color,
  lineWidth,
}: UseCanvasModeArgs) => {
  useEffect(() => {
    if (!canvas) return;

    // First, clean up any active modes
    disableDrawMode(canvas);
    disableEraseMode(canvas);

    // Apply the new mode
    if (mode === "draw") {
      setupDrawMode(canvas, color, lineWidth);
    } else if (mode === "erase") {
      setupEraseMode(canvas);
    } else if (mode === "rectangle") {
      rectangleModeStart(canvas);
    } else if (mode === "circle") {
      circleModeStart(canvas);
    } else if (mode === "triangle") {
      triangleModeStart(canvas);
    } else if (mode === "rhombus") {
      rhombusModeStart(canvas);
    } else if (mode === "select") {
      canvas.selection = true;
      canvas.defaultCursor = "default";
      canvas.isDrawingMode = false;
    } else if (mode === "pan") {
      canvas.selection = false;
      canvas.defaultCursor = "grab";
      canvas.isDrawingMode = false;
    }

    // Force render to ensure mode change takes effect immediately
    canvas.renderAll();
  }, [mode, canvas, color, lineWidth]);
};
