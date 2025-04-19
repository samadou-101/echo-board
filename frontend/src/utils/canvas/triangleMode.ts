import { Canvas, Triangle } from "fabric";

export const triangleModeStart = (canvas: Canvas) => {
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.defaultCursor = "default";

  let triangleCount = 0;

  const createTriangle = () => {
    const offset = triangleCount * 20;
    const triangle = new Triangle({
      left: 100 + offset,
      top: 100 + offset,
      width: 100,
      height: 100,
      fill: "#f3f4f6",
      stroke: "black",
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
