// import { store } from "@redux/store";
import { Canvas } from "fabric";
import { useEffect } from "react";
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
  // const state = store.getState();
  // const isDarkTheme = state.global.isDarkTheme;
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

        initCanvas.renderAll();
        setCanvas(initCanvas);

        // Force another render after a slight delay to ensure DOM is ready
        setTimeout(() => {
          initCanvas.renderAll();
          setIsCanvasReady(true);
        }, 100);

        const handleResize = () => {
          const { width, height } = container.getBoundingClientRect();
          initCanvas.width = width;
          initCanvas.height = height;
          // initCanvas.backgroundColor = isDarkTheme ? "#1f2937" : "#e5e7eb";
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
