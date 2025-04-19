import { useEffect } from "react";
import { Canvas } from "fabric";

interface InitCanvasArgs {
  setIsCanvasReady: React.Dispatch<React.SetStateAction<boolean>>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  setCanvas: React.Dispatch<React.SetStateAction<Canvas | null>>;
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

        // Check if dark mode is active
        const isDarkMode = document.documentElement.classList.contains("dark");
        initCanvas.backgroundColor = isDarkMode ? "#1f2937" : "#f3f4f6"; // Dark mode: gray-800, Light mode: gray-100
        initCanvas.renderAll();
        setCanvas(initCanvas);

        setTimeout(() => {
          initCanvas.renderAll();
          setIsCanvasReady(true);
        }, 100);

        const handleResize = () => {
          const { width, height } = container.getBoundingClientRect();
          initCanvas.setDimensions({ width, height });
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
