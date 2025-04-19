import { Canvas, IText, TPointerEvent } from "fabric";

export const setupTextMode = (canvas: Canvas) => {
  canvas.isDrawingMode = false;
  canvas.selection = false;
  canvas.defaultCursor = "text";

  let textCount = 0;

  const addText = (e: TPointerEvent) => {
    const point = canvas.getScenePoint(e);
    const offset = textCount * 20;
    const text = new IText("Enter text", {
      left: point.x + offset,
      top: point.y + offset,
      fontSize: 20,
      fill: "#000000",
      selectable: true,
    });

    canvas.add(text);
    canvas.bringObjectToFront(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
    textCount++;
  };

  canvas.off("mouse:down");

  canvas.on("mouse:down", (options) => {
    if (!options.target) {
      addText(options.e);
    }
  });
};
