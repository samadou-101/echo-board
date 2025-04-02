import { Server, Socket } from "socket.io";

export const createRoom = (
  socket: Socket,
  roomId: string,
  callback: Function
) => {
  socket.join(roomId);
  console.log(`User ${socket.id} created and joined room: ${roomId}`);

  callback({ success: true, roomId });
};

export const joinRoom = (socket: Socket, io: Server) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    io.to(roomId).emit("user-joined", `User ${socket.id} joined`);
  });
};
