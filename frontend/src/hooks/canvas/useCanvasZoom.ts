/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { Canvas, Point } from "fabric"; // Use Canvas and Point from fabric
import { IEvent } from "fabric/fabric-impl"; // For event typing

// Export ExtendedCanvas interface for use in CanvasArea
export interface ExtendedCanvas extends Canvas {
  zoomIn?: (point?: { x: number; y: number }) => void;
  zoomOut?: (point?: { x: number; y: number }) => void;
  resetZoom?: () => void;
}

export const useCanvasZoom = (canvas: Canvas | null, mode: string) => {
  const zoomFactor = useRef<number>(0.05);
  const minZoom = useRef<number>(0.1);
  const maxZoom = useRef<number>(10);

  useEffect(() => {
    if (!canvas) return;

    const handleMouseWheel = (e: IEvent<WheelEvent>) => {
      if (mode !== "zoom") return;

      const evt = e.e;
      evt.preventDefault();
      evt.stopPropagation();

      const delta = evt.deltaY;
      let zoom = canvas.getZoom();

      // Get mouse position relative to canvas
      const point = canvas.getPointer(evt);

      // Adjust zoom based on scroll direction
      zoom =
        delta > 0
          ? Math.max(minZoom.current, zoom * (1 - zoomFactor.current))
          : Math.min(maxZoom.current, zoom * (1 + zoomFactor.current));

      // Apply zoom at mouse point
      canvas.zoomToPoint(new Point(point.x, point.y), zoom);

      canvas.fire("zoom:updated" as any, { zoom });
      canvas.requestRenderAll();
    };

    const handleZoomPoint = (
      point: { x: number; y: number },
      zoomIn: boolean,
    ) => {
      let zoom = canvas.getZoom();
      zoom = zoomIn
        ? Math.min(maxZoom.current, zoom * (1 + zoomFactor.current))
        : Math.max(minZoom.current, zoom * (1 - zoomFactor.current));

      canvas.zoomToPoint(new Point(point.x, point.y), zoom);
      canvas.fire("zoom:updated" as any, { zoom });
      canvas.requestRenderAll();
    };

    const extendedCanvas = canvas as ExtendedCanvas;

    extendedCanvas.zoomIn = (point?: { x: number; y: number }) => {
      const zoomPoint = point || {
        x: canvas.getWidth() / 2,
        y: canvas.getHeight() / 2,
      };
      handleZoomPoint(zoomPoint, true);
    };

    extendedCanvas.zoomOut = (point?: { x: number; y: number }) => {
      const zoomPoint = point || {
        x: canvas.getWidth() / 2,
        y: canvas.getHeight() / 2,
      };
      handleZoomPoint(zoomPoint, false);
    };

    extendedCanvas.resetZoom = () => {
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvas.setZoom(1);
      canvas.fire("zoom:updated" as any, { zoom: 1 });
      canvas.requestRenderAll();
    };

    canvas.enableRetinaScaling = true;
    canvas.on("mouse:wheel", handleMouseWheel as any);

    return () => {
      canvas.off("mouse:wheel", handleMouseWheel);
      delete extendedCanvas.zoomIn;
      delete extendedCanvas.zoomOut;
      delete extendedCanvas.resetZoom;
    };
  }, [canvas, mode]);
};
