"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
// server/index.ts
const socket_io_1 = require("socket.io");
const room_1 = require("./events/room");
const cursor_1 = require("./events/cursor");
const chat_1 = require("./events/chat");
const setupSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: { origin: "*" },
    });
    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);
        socket.on("create-room", (roomId, callback) => {
            (0, room_1.createRoom)(io, socket, roomId, callback);
        });
        socket.on("join-room", (roomId, callback) => {
            (0, room_1.joinRoom)(io, socket, roomId, callback);
        });
        socket.on("request-users-in-room", (roomId) => {
            const users = (0, room_1.getUsersInRoom)(io, roomId);
            socket.emit("room-users", users);
        });
        (0, cursor_1.handleCursorMove)(socket, io);
        socket.on("draw-start", (data) => {
            if (!data.roomId || !data.drawingData)
                return;
            console.log("Received draw-start", data);
            socket.to(data.roomId).emit("draw-start", {
                drawingData: data.drawingData,
            });
            console.log("Broadcasting draw-start to room", data.roomId);
        });
        socket.on("draw-move", (data) => {
            if (!data.roomId || !data.point || !data.userId)
                return;
            console.log("Received draw-move", data);
            socket.to(data.roomId).emit("draw-move", {
                point: data.point,
                userId: data.userId,
                color: data.color,
                lineWidth: data.lineWidth,
            });
            console.log("Broadcasting draw-move to room", data.roomId);
        });
        socket.on("draw-end", (data) => {
            if (!data.roomId || !data.userId)
                return;
            console.log("Received draw-end", data);
            socket.to(data.roomId).emit("draw-end", {
                userId: data.userId,
            });
            console.log("Broadcasting draw-end to room", data.roomId);
        });
        socket.on("draw-shape", (data) => {
            if (!data.roomId || !data.drawingData)
                return;
            console.log("Received draw-shape", data);
            socket.to(data.roomId).emit("draw-shape", {
                drawingData: data.drawingData,
            });
            console.log("Broadcasting draw-shape to room", data.roomId);
        });
        socket.on("clear-canvas", (data) => {
            if (!data.roomId || !data.userId)
                return;
            console.log("Received clear-canvas", data);
            socket.to(data.roomId).emit("clear-canvas");
            console.log("Broadcasting clear-canvas to room", data.roomId);
        });
        // fabric
        socket.on("canvas:update", (data) => {
            if (!data.roomId || !data.json)
                return;
            socket.to(data.roomId).emit("canvas:update", { json: data.json });
        });
        socket.on("canvas:clear", (data) => {
            const { roomId } = data;
            if (roomId) {
                socket.to(roomId).emit("canvas:clear", { roomId });
            }
        });
        (0, chat_1.setupChatHandlers)(socket, io);
        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${socket.id}`);
            (0, room_1.handleDisconnect)(socket, io);
        });
    });
};
exports.setupSocket = setupSocket;
