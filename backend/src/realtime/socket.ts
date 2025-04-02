import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import {
  createRoom,
  joinRoom,
  getUsersInRoom,
  handleDisconnect,
} from "./events/room";

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // Create room
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

    // Join room
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

    // Request users in room
    socket.on("request-users-in-room", (roomId: string) => {
      const users = getUsersInRoom(io, roomId);
      socket.emit("room-users", users);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
      handleDisconnect(socket, io);
    });
  });

  return io;
};
