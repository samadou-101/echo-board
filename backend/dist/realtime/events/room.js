"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDisconnect = exports.getUsersInRoom = exports.joinRoom = exports.createRoom = void 0;
// Create room event
const createRoom = (io, socket, roomId, callback) => {
    if (!roomId) {
        callback({ success: false, error: "Invalid room ID" });
        return;
    }
    socket.join(roomId);
    console.log(`User ${socket.id} created and joined room: ${roomId}`);
    const users = (0, exports.getUsersInRoom)(io, roomId);
    callback({ success: true, roomId });
    io.to(roomId).emit("room-users", users);
};
exports.createRoom = createRoom;
// Join room event
const joinRoom = (io, socket, roomId, callback) => {
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
    const users = (0, exports.getUsersInRoom)(io, roomId);
    callback({ success: true, roomId });
    socket.to(roomId).emit("user-joined", `User ${socket.id} joined the room`);
    io.to(roomId).emit("room-users", users);
};
exports.joinRoom = joinRoom;
// Get users in room
const getUsersInRoom = (io, roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    return room ? Array.from(room) : [];
};
exports.getUsersInRoom = getUsersInRoom;
// Handle user disconnection
const handleDisconnect = (socket, io) => {
    const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
    rooms.forEach((roomId) => {
        const users = (0, exports.getUsersInRoom)(io, roomId);
        io.to(roomId).emit("room-users", users);
        io.to(roomId).emit("user-left", `User ${socket.id} left the room`);
    });
};
exports.handleDisconnect = handleDisconnect;
