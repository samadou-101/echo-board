// server/index.ts
import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import {
  createRoom,
  joinRoom,
  getUsersInRoom,
  handleDisconnect,
} from "./events/room";
import { handleCursorMove } from "./events/cursor";
import { setupChatHandlers } from "./events/chat";

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on(
      "create-room",
      (
        roomId: string,
        callback: (response: {
          success: boolean;
          roomId?: string;
          error?: string;
        }) => void
      ) => {
        createRoom(io, socket, roomId, callback);
      }
    );

    socket.on(
      "join-room",
      (
        roomId: string,
        callback: (response: {
          success: boolean;
          roomId?: string;
          error?: string;
        }) => void
      ) => {
        joinRoom(io, socket, roomId, callback);
      }
    );

    socket.on("request-users-in-room", (roomId: string) => {
      const users = getUsersInRoom(io, roomId);
      socket.emit("room-users", users);
    });

    handleCursorMove(socket, io);

    socket.on("draw-start", (data: { roomId: string; drawingData: any }) => {
      if (!data.roomId || !data.drawingData) return;
      console.log("Received draw-start", data);
      socket.to(data.roomId).emit("draw-start", {
        drawingData: data.drawingData,
      });
      console.log("Broadcasting draw-start to room", data.roomId);
    });

    socket.on(
      "draw-move",
      (data: {
        roomId: string;
        point: { x: number; y: number };
        userId: string;
        color: string;
        lineWidth: number;
      }) => {
        if (!data.roomId || !data.point || !data.userId) return;
        console.log("Received draw-move", data);
        socket.to(data.roomId).emit("draw-move", {
          point: data.point,
          userId: data.userId,
          color: data.color,
          lineWidth: data.lineWidth,
        });
        console.log("Broadcasting draw-move to room", data.roomId);
      }
    );

    socket.on("draw-end", (data: { roomId: string; userId: string }) => {
      if (!data.roomId || !data.userId) return;
      console.log("Received draw-end", data);
      socket.to(data.roomId).emit("draw-end", {
        userId: data.userId,
      });
      console.log("Broadcasting draw-end to room", data.roomId);
    });

    socket.on("draw-shape", (data: { roomId: string; drawingData: any }) => {
      if (!data.roomId || !data.drawingData) return;
      console.log("Received draw-shape", data);
      socket.to(data.roomId).emit("draw-shape", {
        drawingData: data.drawingData,
      });
      console.log("Broadcasting draw-shape to room", data.roomId);
    });

    socket.on("clear-canvas", (data: { roomId: string; userId: string }) => {
      if (!data.roomId || !data.userId) return;
      console.log("Received clear-canvas", data);
      socket.to(data.roomId).emit("clear-canvas");
      console.log("Broadcasting clear-canvas to room", data.roomId);
    });
    // fabric
    socket.on("canvas:update", (data: { roomId: string; json: any }) => {
      if (!data.roomId || !data.json) return;
      socket.to(data.roomId).emit("canvas:update", { json: data.json });
    });
    socket.on("canvas:clear", (data) => {
      const { roomId } = data;
      if (roomId) {
        socket.to(roomId).emit("canvas:clear", { roomId });
      }
    });
    setupChatHandlers(socket, io);

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
      handleDisconnect(socket, io);
    });
  });
};
