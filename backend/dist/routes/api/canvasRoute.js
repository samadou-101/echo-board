"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const firebaseAdmin_1 = require("../../config/firebaseAdmin");
// Save canvas (create new)
router.post("/save-canvas", async (req, res) => {
    try {
        const { canvas, projectName } = req.body;
        const userId = req.headers["x-user-id"];
        if (!canvas || !projectName) {
            res
                .status(400)
                .json({ error: "Canvas data and project name are required" });
            return;
        }
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const canvasQuery = firebaseAdmin_1.db
            .collection("canvases")
            .where("userId", "==", userId)
            .where("projectName", "==", projectName);
        const querySnapshot = await canvasQuery.get();
        if (!querySnapshot.empty) {
            res
                .status(409)
                .json({ error: "Project name already exists for this user" });
            return;
        }
        const canvasId = `${userId}_${projectName.replace(/\s+/g, "_")}`;
        const canvasDocRef = firebaseAdmin_1.db.collection("canvases").doc(canvasId);
        await canvasDocRef.set({
            canvasData: canvas,
            projectName,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        res.status(201).json({ message: "Canvas saved successfully", canvasId });
        return;
    }
    catch (error) {
        console.error("Error saving canvas:", error);
        res.status(500).json({ error: "Failed to save canvas" });
        return;
    }
});
// Update existing canvas
router.put("/update-canvas/:canvasId", async (req, res) => {
    try {
        const { canvasId } = req.params;
        const { canvas } = req.body;
        const userId = req.headers["x-user-id"];
        if (!canvas) {
            res.status(400).json({ error: "Canvas data is required" });
            return;
        }
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const canvasDocRef = firebaseAdmin_1.db.collection("canvases").doc(canvasId);
        const docSnap = await canvasDocRef.get();
        if (!docSnap.exists) {
            res.status(404).json({ error: "Canvas not found" });
            return;
        }
        const canvasData = docSnap.data();
        if (canvasData?.userId !== userId) {
            res.status(403).json({ error: "Unauthorized access to canvas" });
            return;
        }
        await canvasDocRef.set({
            canvasData: canvas,
            updatedAt: new Date().toISOString(),
        }, { merge: true });
        res.status(200).json({ message: "Canvas updated successfully" });
        return;
    }
    catch (error) {
        console.error("Error updating canvas:", error);
        res.status(500).json({ error: "Failed to update canvas" });
        return;
    }
});
// Load canvas by ID
router.get("/load-canvas/:canvasId", async (req, res) => {
    try {
        const { canvasId } = req.params;
        const userId = req.headers["x-user-id"];
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const canvasDocRef = firebaseAdmin_1.db.collection("canvases").doc(canvasId);
        const docSnap = await canvasDocRef.get();
        if (!docSnap.exists) {
            res.status(404).json({ error: "Canvas not found" });
            return;
        }
        const canvasData = docSnap.data();
        if (canvasData?.userId !== userId) {
            res.status(403).json({ error: "Unauthorized access to canvas" });
            return;
        }
        res.status(200).json({
            canvas: canvasData.canvasData,
            projectName: canvasData.projectName,
            createdAt: canvasData.createdAt,
            updatedAt: canvasData.updatedAt,
        });
        return;
    }
    catch (error) {
        console.error("Error loading canvas:", error);
        res.status(500).json({ error: "Failed to load canvas" });
        return;
    }
});
// List all canvases for a user
router.get("/list-canvases", async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const canvasQuery = firebaseAdmin_1.db.collection("canvases").where("userId", "==", userId);
        const querySnapshot = await canvasQuery.get();
        const canvases = querySnapshot.docs.map((doc) => ({
            canvasId: doc.id,
            projectName: doc.data().projectName,
            createdAt: doc.data().createdAt,
            updatedAt: doc.data().updatedAt,
        }));
        res.status(200).json({ canvases });
        return;
    }
    catch (error) {
        console.error("Error listing canvases:", error);
        res.status(500).json({ error: "Failed to list canvases" });
        return;
    }
});
// // Delete canvas
// router.delete(
//   "/delete-canvas/:canvasId",
//   async (req: Request, res: Response) => {
//     try {
//       const { canvasId } = req.params;
//       const userId = req.headers["x-user-id"] as string;
//       if (!userId) {
//         res.status(401).json({ error: "User not authenticated" });
//         return;
//       }
//       const canvasDocRef = db.collection("canvases").doc(canvasId);
//       const docSnap = await canvasDocRef.get();
//       if (!docSnap.exists) {
//         res.status(404).json({ error: "Canvas not found" });
//         return;
//       }
//       const canvasData = docSnap.data();
//       if (canvasData?.userId !== userId) {
//         res.status(403).json({ error: "Unauthorized access to canvas" });
//         return;
//       }
//       await canvasDocRef.set(
//         {
//           deleted: true,
//           deletedAt: new Date().toISOString(),
//         },
//         { merge: true }
//       );
//       res.status(200).json({ message: "Canvas deleted successfully" });
//       return;
//     } catch (error) {
//       console.error("Error deleting canvas:", error);
//       res.status(500).json({ error: "Failed to delete canvas" });
//       return;
//     }
//   }
// );
// Delete canvas
router.delete("/delete-canvas/:canvasId", async (req, res) => {
    try {
        const { canvasId } = req.params;
        const userId = req.headers["x-user-id"];
        if (!userId) {
            res.status(401).json({ error: "User not authenticated" });
            return;
        }
        const canvasDocRef = firebaseAdmin_1.db.collection("canvases").doc(canvasId);
        const docSnap = await canvasDocRef.get();
        if (!docSnap.exists) {
            res.status(404).json({ error: "Canvas not found" });
            return;
        }
        const canvasData = docSnap.data();
        if (canvasData?.userId !== userId) {
            res.status(403).json({ error: "Unauthorized access to canvas" });
            return;
        }
        await canvasDocRef.delete();
        res.status(200).json({ message: "Canvas deleted successfully" });
        return;
    }
    catch (error) {
        console.error("Error deleting canvas:", error);
        res.status(500).json({ error: "Failed to delete canvas" });
        return;
    }
});
exports.default = router;
