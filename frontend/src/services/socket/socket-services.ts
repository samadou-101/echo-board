import { io } from "socket.io-client";
import { Canvas } from "fabric";

const socket = io("http://localhost:3000");

export const emitCanvasChange = (canvas: Canvas, roomId: string) => {
  if (!canvas || !roomId) return;
  const json = canvas.toJSON();
  socket.emit("canvas:update", { roomId, json });
};
