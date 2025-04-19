import { Canvas, Rect } from "fabric";

export const rectangleModeStart = (canvas: Canvas) => {
  // Set canvas to selection mode
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.defaultCursor = "default";

  // Counter for rectangle positions
  let rectCount = 0;

  // Function to create a new rectangle
  const createRectangle = () => {
    const offset = rectCount * 20; // Stagger positions slightly
    const rect = new Rect({
      left: 100 + offset,
      top: 100 + offset,
      width: 100,
      height: 60,
      fill: "#f3f4f6",
      stroke: "black",
      strokeWidth: 2,
      selectable: true,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.requestRenderAll();
    rectCount++;
  };

  canvas.off("mouse:down");

  canvas.on("mouse:down", (options) => {
    if (!options.target) {
      createRectangle();
    }
  });

  createRectangle();
};
