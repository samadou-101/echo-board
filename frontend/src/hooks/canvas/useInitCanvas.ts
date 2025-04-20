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
  useEffect(() => {
    if (canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        const isMediumOrSmaller = window.innerWidth <= 768; // md breakpoint
        const width = container.getBoundingClientRect().width;
        const height = isMediumOrSmaller
          ? window.innerHeight
          : container.getBoundingClientRect().height;

        const initCanvas = new Canvas(canvasRef.current, {
          width,
          height,
          isDrawingMode: false,
          selection: true,
          preserveObjectStacking: true,
        });

        initCanvas.renderAll();
        setCanvas(initCanvas);

        setTimeout(() => {
          initCanvas.renderAll();
          setIsCanvasReady(true);
        }, 100);

        const handleResize = () => {
          const newWidth = container.getBoundingClientRect().width;
          const newHeight = isMediumOrSmaller
            ? window.innerHeight
            : container.getBoundingClientRect().height;
          initCanvas.setDimensions({ width: newWidth, height: newHeight });
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
