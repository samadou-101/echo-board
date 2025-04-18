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

const io_url = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://echo-board-oqis.onrender.com";
// const socket = io("http://localhost:3000");
const socket = io(io_url);

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
