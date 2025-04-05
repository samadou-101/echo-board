/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import type { Canvas } from "fabric";

interface UseCanvasPanArgs {
  canvas: Canvas | null;
  mode: string;
  lastPosX: React.RefObject<number>;
  lastPosY: React.RefObject<number>;
}

export const useCanvasPan = ({
  canvas,
  mode,
  lastPosX,
  lastPosY,
}: UseCanvasPanArgs) => {
  useEffect(() => {
    if (!canvas) return;

    const handlePanMouseDown = (e: any) => {
      if (mode !== "pan") return;
      canvas.defaultCursor = "grabbing";
      canvas.renderAll();
      lastPosX.current = e.e.clientX;
      lastPosY.current = e.e.clientY;
    };

    const handlePanMouseMove = (e: any) => {
      if (mode !== "pan" || !lastPosX.current || !lastPosY.current) return;

      const vpt = canvas.viewportTransform;
      if (!vpt) return;

      const deltaX = e.e.clientX - lastPosX.current;
      const deltaY = e.e.clientY - lastPosY.current;

      vpt[4] += deltaX;
      vpt[5] += deltaY;

      canvas.setViewportTransform(vpt);
      canvas.requestRenderAll();

      lastPosX.current = e.e.clientX;
      lastPosY.current = e.e.clientY;
    };

    const handlePanMouseUp = () => {
      if (mode !== "pan") return;
      canvas.defaultCursor = "grab";
      canvas.renderAll();
      lastPosX.current = 0;
      lastPosY.current = 0;
    };

    canvas.on("mouse:down", handlePanMouseDown);
    canvas.on("mouse:move", handlePanMouseMove);
    canvas.on("mouse:up", handlePanMouseUp);

    return () => {
      canvas.off("mouse:down", handlePanMouseDown);
      canvas.off("mouse:move", handlePanMouseMove);
      canvas.off("mouse:up", handlePanMouseUp);
    };
  }, [canvas, mode]);
};
