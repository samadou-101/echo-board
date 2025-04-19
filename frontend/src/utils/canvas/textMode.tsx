import { store } from "@redux/store";
import { Canvas, IText, TPointerEvent } from "fabric";

export const setupTextMode = (canvas: Canvas) => {
  canvas.isDrawingMode = false;
  canvas.selection = false;
  canvas.defaultCursor = "text";

  const state = store.getState();
  const isDarkTheme = state.global.isDarkTheme;

  let textCount = 0;

  const addText = (e: TPointerEvent) => {
    const point = canvas.getScenePoint(e);
    const offset = textCount * 20;

    const text = new IText("Enter text", {
      left: point.x + offset,
      top: point.y + offset,
      fontSize: 20,
      fontWeight: "400", // Explicitly normal weight (400 is standard for normal)
      fontFamily: "Arial, sans-serif", // Specify a clean font to avoid rendering issues
      fill: isDarkTheme ? "#ffffff" : "#000000", // Text color based on theme
      stroke: null, // Explicitly disable stroke
      strokeWidth: 0, // Ensure no stroke width
      selectable: true,
      textBackgroundColor: "transparent", // Prevent background interference
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
