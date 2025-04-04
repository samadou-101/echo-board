import { io } from "socket.io-client";
import { Canvas } from "fabric";

// Extend Fabric.js types
declare module "fabric" {
  interface Object {
    id?: string;
  }
  interface Canvas {
    toJSON(propertiesToInclude?: string[]): unknown;
  }
}

const socket = io("http://localhost:3000");

export const emitCanvasChange = (canvas: Canvas, roomId: string) => {
  if (!canvas || !roomId) return;

  canvas.forEachObject((obj) => {
    if (!obj.id) {
      obj.id = `obj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
  });

  const json = canvas.toJSON(["id"]);
  socket.emit("canvas:update", { roomId, json });
};
