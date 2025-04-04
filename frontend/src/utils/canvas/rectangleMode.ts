import { Canvas, Rect } from "fabric";

export const rectangleModeStart = (canvas: Canvas) => {
  console.log("test");
  const rect = new Rect({
    left: 100,
    top: 100,
    width: 100,
    height: 60,
    fill: "white",
    stroke: "black",
    strokeWidth: 2,
    selectable: true,
  });
  canvas.add(rect);
  canvas.renderAll();
};
