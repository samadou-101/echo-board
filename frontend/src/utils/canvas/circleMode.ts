import { Canvas, Circle } from "fabric";

export const circleModeStart = (canvas: Canvas) => {
  const circle = new Circle({
    left: 100,
    top: 100,
    radius: 50,
    fill: "white",
    stroke: "black",
    strokeWidth: 2,
    selectable: true,
  });
  canvas.add(circle);
  canvas.renderAll();
};
