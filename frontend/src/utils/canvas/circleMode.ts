import { Canvas, Circle } from "fabric";

export const circleModeStart = (canvas: Canvas) => {
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.defaultCursor = "default";

  let circleCount = 0;

  const createCircle = () => {
    const offset = circleCount * 20;
    const circle = new Circle({
      left: 100 + offset,
      top: 100 + offset,
      radius: 50,
      fill: "#f3f4f6",
      stroke: "black",
      strokeWidth: 2,
      selectable: true,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.requestRenderAll();
    circleCount++;
  };

  canvas.off("mouse:down");

  canvas.on("mouse:down", (options) => {
    if (!options.target) {
      createCircle();
    }
  });

  createCircle();
};
