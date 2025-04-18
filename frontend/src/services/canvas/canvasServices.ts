import { Canvas } from "fabric";
import { auth } from "@config/firebase";

// interface CanvasData {
//   canvas: string;
//   projectName: string;
// }

export interface CanvasResponse {
  canvasId?: string;
  message?: string;
  error?: string;
  canvas?: string;
  projectName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CanvasesResponse {
  canvases: {
    canvasId: string;
    projectName: string;
    createdAt: string;
    updatedAt: string;
  }[];
  error?: string;
}

const URL = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://echo-board-oqis.onrender.com";

const getUserId = async (): Promise<string | null> => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

export const saveCanvas = async (
  canvas: Canvas,
  projectName: string,
): Promise<CanvasResponse> => {
  try {
    if (!canvas || !projectName.trim()) {
      return { error: "Canvas and project name are required" }; // Ensure we return a CanvasResponse here
    }

    const userId = await getUserId();
    if (!userId) {
      return { error: "User not authenticated" };
    }

    const json = JSON.stringify(
      canvas.toJSON([
        "id",
        "selectable",
        "evented",
        "background",
        "backgroundColor",
        "fill",
        "stroke", // Exclude stroke color
        "strokeWidth", // Exclude stroke width
        "strokeDashArray", // Exclude stroke dash array
        "strokeLineCap", // Exclude stroke line cap
        "strokeDashOffset", // Exclude stroke dash offset
        "strokeLineJoin", // Exclude stroke line join
        "strokeUniform", // Exclude stroke uniform
        "strokeMiterLimit", // Exclude stroke miter limit
        "shadow",
      ]),
    );
    const response = await fetch(
      // "http://localhost:3000/api/save-canvas"
      `${URL}/api/save-canvas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ canvas: json, projectName }),
      },
    );

    const data: CanvasResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Server responded with status ${response.status}`,
      );
    }

    return data; // Ensure we always return a CanvasResponse object
  } catch (error) {
    console.error("Failed to save canvas:", error);
    return { error: "Failed to save canvas" }; // Always return a CanvasResponse on error
  }
};

export const updateCanvas = async (
  canvas: Canvas,
  canvasId: string,
): Promise<CanvasResponse> => {
  try {
    if (!canvas || !canvasId) {
      return { error: "Canvas and canvas ID are required" };
    }

    const userId = await getUserId();
    if (!userId) {
      return { error: "User not authenticated" };
    }

    const json = JSON.stringify(
      canvas.toJSON([
        "id",
        "selectable",
        "evented",
        "background",
        "backgroundColor",
        "fill",
        "stroke", // Exclude stroke color
        "strokeWidth", // Exclude stroke width
        "strokeDashArray", // Exclude stroke dash array
        "strokeLineCap", // Exclude stroke line cap
        "strokeDashOffset", // Exclude stroke dash offset
        "strokeLineJoin", // Exclude stroke line join
        "strokeUniform", // Exclude stroke uniform
        "strokeMiterLimit", // Exclude stroke miter limit
        "shadow",
      ]),
    );
    const response = await fetch(
      // `http://localhost:3000/api/update-canvas/${canvasId}`,
      `${URL}/api/update-canvas/${canvasId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ canvas: json }),
      },
    );

    const data: CanvasResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Server responded with status ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    console.error("Failed to update canvas:", error);
    return { error: "Failed to update canvas" };
  }
};

export const loadCanvas = async (canvasId: string): Promise<CanvasResponse> => {
  try {
    if (!canvasId) {
      return { error: "Canvas ID is required" };
    }

    const userId = await getUserId();
    if (!userId) {
      return { error: "User not authenticated" };
    }

    const response = await fetch(
      // `http://localhost:3000/api/load-canvas/${canvasId}`,
      `${URL}/api/load-canvas/${canvasId}`,
      {
        method: "GET",
        headers: {
          "x-user-id": userId,
        },
      },
    );

    const data: CanvasResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Server responded with status ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    console.error("Failed to load canvas:", error);
    return { error: "Failed to load canvas" };
  }
};

export const listCanvases = async (): Promise<CanvasesResponse> => {
  try {
    const userId = await getUserId();
    if (!userId) {
      return { canvases: [], error: "User not authenticated" };
    }

    const response = await fetch(
      // "http://localhost:3000/api/list-canvases"
      `${URL}/api/list-canvases`,
      {
        method: "GET",
        headers: {
          "x-user-id": userId,
        },
      },
    );

    const data: CanvasesResponse = await response.json();

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Failed to list canvases:", error);
    return { canvases: [], error: "Failed to list canvases" };
  }
};

export const deleteCanvas = async (
  canvasId: string,
): Promise<CanvasResponse> => {
  try {
    if (!canvasId) {
      return { error: "Canvas ID is required" };
    }

    const userId = await getUserId();
    if (!userId) {
      return { error: "User not authenticated" };
    }

    const response = await fetch(
      // `http://localhost:3000/api/delete-canvas/${canvasId}`,
      `${URL}/api/delete-canvas/${canvasId}`,
      {
        method: "DELETE",
        headers: {
          "x-user-id": userId,
        },
      },
    );

    const data: CanvasResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Server responded with status ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    console.error("Failed to delete canvas:", error);
    return { error: "Failed to delete canvas" };
  }
};

export const loadCanvasToEditor = async (
  canvasId: string,
  canvasInstance: Canvas | null,
  setCanvas: (canvas: Canvas | null) => void,
): Promise<void> => {
  if (!canvasInstance || !canvasId) {
    console.error("Canvas instance or ID missing");
    return;
  }
  try {
    const response: CanvasResponse = await loadCanvas(canvasId);
    if ("error" in response && response.error) {
      throw new Error(response.error);
    }
    if (response.canvas) {
      canvasInstance.clear();

      canvasInstance.loadFromJSON(JSON.parse(response.canvas), () => {
        canvasInstance.setDimensions({
          width: canvasInstance.getWidth(),
          height: canvasInstance.getHeight(),
        });

        canvasInstance.calcViewportBoundaries();
        canvasInstance.forEachObject((obj) => {
          obj.setCoords();
        });

        canvasInstance.renderAll();

        setCanvas(canvasInstance);

        setTimeout(() => {
          canvasInstance.requestRenderAll();
          window.dispatchEvent(new Event("resize"));
          setTimeout(() => {
            canvasInstance.requestRenderAll();
          }, 50);
        }, 50);
      });

      console.log(`Canvas "${response.projectName}" loaded successfully`);
    }
  } catch (error) {
    console.error("Failed to load canvas:", error);
    alert("Failed to load canvas");
  }
};
