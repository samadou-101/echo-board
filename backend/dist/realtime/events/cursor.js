"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCursorMove = void 0;
const handleCursorMove = (socket, io) => {
    socket.on("cursor-move", (data) => {
        const { userId, x, y, screenWidth, screenHeight } = data;
        // Validate the coordinates are percentages
        const isValidX = x >= 0 && x <= 100;
        const isValidY = y >= 0 && y <= 100;
        if (!isValidX || !isValidY) {
            console.warn(`Invalid cursor coordinates received from ${userId}: x=${x}, y=${y}`);
            return;
        }
        // Get all rooms the socket is in (excluding their private room)
        const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
        if (rooms.length > 0) {
            // Broadcast to all clients in the same room
            io.to(rooms[0]).emit("cursor-move", {
                userId,
                x,
                y,
                screenWidth, // forward the original screen dimensions if provided
                screenHeight,
            });
        }
    });
};
exports.handleCursorMove = handleCursorMove;
