import { Canvas, Triangle } from "fabric";

export const triangleModeStart = (canvas: Canvas) => {
  const triangle = new Triangle({
    left: 100,
    top: 100,
    width: 100,
    height: 100,
    fill: "#f3f4f6",
    stroke: "black",
    strokeWidth: 2,
    selectable: true,
  });
  canvas.add(triangle);
  canvas.renderAll();
};
