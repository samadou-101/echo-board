import { Canvas } from "fabric";

export const setupEraseMode = (canvas: Canvas) => {
  canvas.selection = false;
  canvas.defaultCursor = "pointer";

  canvas.on("mouse:down", (options) => {
    if (options.target) {
      canvas.remove(options.target);
      canvas.renderAll();
    }
  });
};

export const disableEraseMode = (canvas: fabric.Canvas) => {
  canvas.off("mouse:down");
  canvas.selection = true;
  canvas.defaultCursor = "default";
};
