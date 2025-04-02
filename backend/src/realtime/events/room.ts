import { Server, Socket } from "socket.io";

interface RoomResponse {
  success: boolean;
  roomId?: string;
  error?: string;
}

// Create room event
export const createRoom = (
  io: Server,
  socket: Socket,
  roomId: string,
  callback: (response: RoomResponse) => void
) => {
  if (!roomId) {
    callback({ success: false, error: "Invalid room ID" });
    return;
  }

  socket.join(roomId);
  console.log(`User ${socket.id} created and joined room: ${roomId}`);

  const users = getUsersInRoom(io, roomId);
  callback({ success: true, roomId });
  io.to(roomId).emit("room-users", users);
};

// Join room event
export const joinRoom = (
  io: Server,
  socket: Socket,
  roomId: string,
  callback: (response: RoomResponse) => void
) => {
  if (!roomId) {
    callback({ success: false, error: "Invalid room ID" });
    return;
  }

  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room) {
    callback({ success: false, error: "Room does not exist" });
    return;
  }

  socket.join(roomId);
  console.log(`User ${socket.id} joined room ${roomId}`);

  const users = getUsersInRoom(io, roomId);
  callback({ success: true, roomId });

  socket.to(roomId).emit("user-joined", `User ${socket.id} joined the room`);
  io.to(roomId).emit("room-users", users);
};

// Get users in room
export const getUsersInRoom = (io: Server, roomId: string): string[] => {
  const room = io.sockets.adapter.rooms.get(roomId);
  return room ? Array.from(room) : [];
};

// Handle user disconnection
export const handleDisconnect = (socket: Socket, io: Server) => {
  const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
  rooms.forEach((roomId) => {
    const users = getUsersInRoom(io, roomId);
    io.to(roomId).emit("room-users", users);
    io.to(roomId).emit("user-left", `User ${socket.id} left the room`);
  });
};
