import { setupDrawMode } from "@utils/canvas/drawMode";
export type CanvasMode =
  | "select"
  | "draw"
  | "erase"
  | "circle"
  | "rectangle"
  | "triangle"
  | "rhombus"
  | "pan";

export const handleModeChange = (
  newMode: CanvasMode,
  setMode: React.Dispatch<React.SetStateAction<CanvasMode>>,
) => {
  setMode(newMode);
};

export const handleTabChange = (
  value: string,
  handleModeChange: (newMode: CanvasMode) => void,
) => {
  if (value === "select") {
    handleModeChange("select");
  } else if (value === "draw") {
    handleModeChange("draw");
  }
};

import { Canvas } from "fabric";
import socket from "@services/socket/socket";

export const handleClearCanvas = (
  canvas: Canvas | null,
  roomId: string | null,
) => {
  if (canvas) {
    canvas.clear();
    canvas.backgroundColor = "#f3f4f6";
    canvas.renderAll();
    if (roomId) {
      socket.emit("canvas:clear", { roomId });
    }
  }
};

export const handleLineWidthChange = (
  e: React.ChangeEvent<HTMLSelectElement>,
  setLineWidth: React.Dispatch<React.SetStateAction<number>>,
  mode: CanvasMode,
  canvas: Canvas | null,
  color: string,
) => {
  const width = parseInt(e.target.value);
  setLineWidth(width);
  if (mode === "draw" && canvas) {
    setupDrawMode(canvas, color, width);
  }
};

export const handleColorChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setColor: React.Dispatch<React.SetStateAction<string>>,
  mode: CanvasMode,
  canvas: Canvas | null,
  lineWidth: number,
) => {
  const newColor = e.target.value;
  setColor(newColor);
  if (mode === "draw" && canvas) {
    setupDrawMode(canvas, newColor, lineWidth);
  }
};
