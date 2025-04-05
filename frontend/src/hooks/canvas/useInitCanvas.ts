/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAppSelector } from "@hooks/redux/redux-hooks";
import { Canvas } from "fabric";
import { useEffect, useRef, useState } from "react";
import socket from "@services/socket/socket";
interface InitCanvasArgs {
  setIsCanvasReady: React.Dispatch<React.SetStateAction<boolean>>;
  // containerRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  setCanvas: React.Dispatch<React.SetStateAction<Canvas | null>>;
  // resizeObserverRef: React.RefObject<ResizeObserver | null>;
  // roomId: string | null;
  // isReceivingUpdate: React.MutableRefObject<boolean>;
}
export const useInitCanvas = ({
  setIsCanvasReady,
  canvasRef,
  setCanvas,
}: InitCanvasArgs) => {
  useEffect(() => {
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const { width, height } = container.getBoundingClientRect();

        const initCanvas = new Canvas(canvasRef.current, {
          width,
          height,
          isDrawingMode: false,
          selection: true,
          preserveObjectStacking: true,
        });

        initCanvas.backgroundColor = "#f3f4f6";
        initCanvas.renderAll();
        setCanvas(initCanvas);

        // Force another render after a slight delay to ensure DOM is ready
        setTimeout(() => {
          initCanvas.renderAll();
          setIsCanvasReady(true);
        }, 100);

        const handleResize = () => {
          const { width, height } = container.getBoundingClientRect();
          initCanvas.setWidth(width);
          initCanvas.setHeight(height);
          initCanvas.renderAll();
        };

        window.addEventListener("resize", handleResize);

        return () => {
          window.removeEventListener("resize", handleResize);
          initCanvas.dispose();
        };
      }
    }
  }, []);
};
