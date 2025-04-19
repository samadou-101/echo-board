import { store } from "@redux/store";
import { Canvas, Triangle } from "fabric";

export const triangleModeStart = (canvas: Canvas) => {
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.defaultCursor = "default";
  const state = store.getState();

  const isDarkTheme = state.global.isDarkTheme;
  let triangleCount = 0;

  const createTriangle = () => {
    const offset = triangleCount * 20;
    const triangle = new Triangle({
      left: 100 + offset,
      top: 100 + offset,
      width: 100,
      height: 100,
      fill: "transparent",
      stroke: isDarkTheme ? "white" : "black",
      strokeWidth: 2,
      selectable: true,
    });

    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.requestRenderAll();
    triangleCount++;
  };

  canvas.off("mouse:down");

  canvas.on("mouse:down", (options) => {
    if (!options.target) {
      createTriangle();
    }
  });

  createTriangle();
};
