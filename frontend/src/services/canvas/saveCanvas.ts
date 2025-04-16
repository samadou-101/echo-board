import { Canvas } from "fabric";
import axios from "axios";

export const saveCanvas = async (
  canvas: Canvas | null,
  title: string,
): Promise<void> => {
  if (!canvas) {
    throw new Error("Canvas is not initialized");
  }

  const canvasData = JSON.stringify(canvas.toJSON());

  try {
    await axios.post("/api/canvas", {
      title,
      content: canvasData,
    });
  } catch (error) {
    console.error("Error saving canvas:", error);
    throw new Error("Failed to save canvas");
  }
};

interface CanvasResponseData {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const loadCanvas = async (
  canvas: Canvas | null,
  canvasId: string,
): Promise<void> => {
  if (!canvas) {
    throw new Error("Canvas is not initialized");
  }

  try {
    const response = await axios.get<CanvasResponseData>(
      `/api/canvas/${canvasId}`,
    );
    const canvasData = response.data.content;
    canvas.loadFromJSON(canvasData, () => {
      canvas.renderAll();
    });
  } catch (error) {
    console.error("Error loading canvas:", error);
    throw new Error("Failed to load canvas");
  }
};
