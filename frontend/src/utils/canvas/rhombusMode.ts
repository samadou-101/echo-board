import { Canvas, Polygon } from "fabric";

export const rhombusModeStart = (canvas: Canvas) => {
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.defaultCursor = "default";

  let rhombusCount = 0;

  const createRhombus = () => {
    const offset = rhombusCount * 20;
    const rhombus = new Polygon(
      [
        { x: 50, y: 0 },
        { x: 100, y: 50 },
        { x: 50, y: 100 },
        { x: 0, y: 50 },
      ],
      {
        left: 100 + offset,
        top: 100 + offset,
        fill: "#f3f4f6",
        stroke: "black",
        strokeWidth: 2,
        selectable: true,
      },
    );

    canvas.add(rhombus);
    canvas.setActiveObject(rhombus);
    canvas.requestRenderAll();
    rhombusCount++;
  };

  canvas.off("mouse:down");

  canvas.on("mouse:down", (options) => {
    if (!options.target) {
      createRhombus();
    }
  });

  createRhombus();
};
