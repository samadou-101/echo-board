import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { createRoom } from "./events/room";

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    socket.on("create-room", (roomId, callback) =>
      createRoom(socket, roomId, callback)
    );
    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return io;
};
