import { store } from "@redux/store";
import { Canvas, Line, Circle, Group } from "fabric";

export const lineModeStart = (canvas: Canvas, lineWidth: number) => {
  // Accessing the dark theme value directly from the store
  const state = store.getState();
  let currentTheme = state.global.isDarkTheme;

  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.defaultCursor = "default";

  // Set the color based on currentTheme
  const getColor = (isDark: boolean) => (isDark ? "white" : "black");
  const getBorderColor = (isDark: boolean) => (isDark ? "white" : "black");

  let lineCount = 0;

  const createLine = () => {
    const offset = lineCount * 20;
    const x1 = 100 + offset;
    const y1 = 100 + offset;
    const x2 = x1 + 150;
    const y2 = y1;

    // Create line with anti-aliasing options
    const line = new Line([x1, y1, x2, y2], {
      stroke: getColor(currentTheme),
      strokeWidth: lineWidth,
      strokeLineCap: "round", // Add rounded ends to improve appearance
      strokeLineJoin: "round", // Smooth out any corners
      selectable: false,
      evented: false,
    });

    // Create endpoints with improved visibility
    const startCircle = new Circle({
      left: x1,
      top: y1,
      radius: 0, // Increased size for better visibility
      fill: getColor(currentTheme),
      stroke: getColor(currentTheme),
      strokeWidth: 1,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: true,
      hasControls: false,
      hasBorders: false,
    });

    const endCircle = new Circle({
      left: x2,
      top: y2,
      radius: 0, // Increased size for better visibility
      fill: getColor(currentTheme),
      stroke: getColor(currentTheme),
      strokeWidth: 1,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: true,
      hasControls: false,
      hasBorders: false,
    });

    // Group with improved selection appearance
    const group = new Group([line, startCircle, endCircle], {
      selectable: true,
      cornerColor: getBorderColor(currentTheme),
      cornerSize: 8, // Larger corner handles
      cornerStrokeColor: getBorderColor(currentTheme),
      transparentCorners: false,
      borderColor: getBorderColor(currentTheme),
      borderScaleFactor: 1.5, // Make selection border more visible
      hasControls: true,
      lockScalingFlip: true,
    });

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.requestRenderAll();
    lineCount++;

    const updateLine = () => {
      const p1 = startCircle.getCenterPoint();
      const p2 = endCircle.getCenterPoint();
      line.set({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
    };

    startCircle.on("moving", updateLine);
    endCircle.on("moving", updateLine);
  };

  canvas.off("mouse:down");
  canvas.on("mouse:down", (options) => {
    if (!options.target) {
      createLine();
    }
  });

  createLine();

  // Listen for theme change and update colors without clearing the canvas
  const unsubscribe = store.subscribe(() => {
    const updatedState = store.getState();
    const newDarkTheme = updatedState.global.isDarkTheme;

    // Only update if the theme has actually changed
    if (newDarkTheme !== currentTheme) {
      // Update our current theme tracker
      currentTheme = newDarkTheme;
      const newColor = getColor(currentTheme);
      const newBorderColor = getBorderColor(currentTheme);

      // Update all objects on the canvas
      canvas.getObjects().forEach((obj) => {
        if (obj instanceof Group) {
          // Update group border properties
          obj.set({
            cornerColor: newBorderColor,
            borderColor: newBorderColor,
            cornerStrokeColor: newBorderColor,
          });

          // Update objects within the group
          obj.getObjects().forEach((groupObj) => {
            if (groupObj instanceof Line) {
              groupObj.set({
                stroke: newColor,
              });
            }
            if (groupObj instanceof Circle) {
              groupObj.set({
                fill: newColor,
                stroke: newColor,
              });
            }
          });
        }
      });

      // Request a re-render after color update
      canvas.requestRenderAll();
    }
  });

  // Return unsubscribe function to prevent memory leaks
  return unsubscribe;
};
