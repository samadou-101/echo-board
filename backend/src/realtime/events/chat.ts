// server/events/chat.ts
import { Server, Socket } from "socket.io";

interface ChatMessage {
  userId: string;
  message: string;
  timestamp: number;
}

// In-memory storage for messages (in a production app, you'd use a database)
const roomMessages: Record<string, ChatMessage[]> = {};

// Maximum number of messages to store per room
const MAX_MESSAGES_PER_ROOM = 100;

export const setupChatHandlers = (socket: Socket, io: Server) => {
  // Handle new chat messages
  socket.on(
    "chat-message",
    (data: { roomId: string; message: ChatMessage }) => {
      const { roomId, message } = data;

      if (!roomId || !message) return;

      // Store the message
      if (!roomMessages[roomId]) {
        roomMessages[roomId] = [];
      }

      // Add message to storage
      roomMessages[roomId].push(message);

      // Trim messages if exceeding maximum
      if (roomMessages[roomId].length > MAX_MESSAGES_PER_ROOM) {
        roomMessages[roomId] = roomMessages[roomId].slice(
          -MAX_MESSAGES_PER_ROOM
        );
      }

      // Broadcast to everyone in the room except sender
      socket.to(roomId).emit("chat-message", message);

      console.log(`Chat message in room ${roomId} from ${message.userId}`);
    }
  );

  // Handle typing indicators
  socket.on(
    "typing",
    (data: { roomId: string; userId: string; isTyping: boolean }) => {
      const { roomId, userId, isTyping } = data;

      if (!roomId || !userId) return;

      // Broadcast typing status to everyone in the room except sender
      socket.to(roomId).emit("typing", { userId, isTyping });
    }
  );

  // Handle requests for message history
  socket.on("get-messages", (roomId: string, callback) => {
    if (typeof callback !== "function") return;

    // Return messages for the room or an empty array if none exist
    const messages = roomMessages[roomId] || [];
    callback(messages);

    console.log(`Sent ${messages.length} messages for room ${roomId}`);
  });
};

// Handle cleanup when a room is deleted
export const cleanupRoomMessages = (roomId: string) => {
  if (roomMessages[roomId]) {
    delete roomMessages[roomId];
    console.log(`Cleaned up messages for room ${roomId}`);
  }
};
