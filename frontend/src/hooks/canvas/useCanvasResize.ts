import { useEffect } from "react";
import { Canvas } from "fabric";

export const useCanvasResize = (
  canvas: Canvas | null,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isCanvasReady: boolean,
) => {
  useEffect(() => {
    if (canvas && canvasRef.current && isCanvasReady) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        if (width > 0 && height > 0) {
          canvas.setDimensions({ width, height });
          canvas.renderAll();
        }
      }
    }
  }, [canvas, canvasRef, isCanvasReady]);
};
