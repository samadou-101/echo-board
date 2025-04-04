import { Server, Socket } from "socket.io";

interface CursorMoveData {
  userId: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  screenWidth?: number; // original screen width (optional)
  screenHeight?: number; // original screen height (optional)
}

export const handleCursorMove = (socket: Socket, io: Server) => {
  socket.on("cursor-move", (data: CursorMoveData) => {
    const { userId, x, y, screenWidth, screenHeight } = data;

    // Validate the coordinates are percentages
    const isValidX = x >= 0 && x <= 100;
    const isValidY = y >= 0 && y <= 100;

    if (!isValidX || !isValidY) {
      console.warn(
        `Invalid cursor coordinates received from ${userId}: x=${x}, y=${y}`
      );
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
