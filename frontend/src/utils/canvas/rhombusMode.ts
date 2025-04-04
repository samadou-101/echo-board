import { Canvas, Polygon } from "fabric";

export const rhombusModeStart = (canvas: Canvas) => {
  const rhombus = new Polygon(
    [
      { x: 50, y: 0 },
      { x: 100, y: 50 },
      { x: 50, y: 100 },
      { x: 0, y: 50 },
    ],
    {
      left: 100,
      top: 100,
      fill: "white",
      stroke: "black",
      strokeWidth: 2,
      selectable: true,
    },
  );
  canvas.add(rhombus);
  canvas.renderAll();
};
