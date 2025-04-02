import socket from "./socket";

interface CreateRoomResponse {
  success: boolean;
  roomId?: string;
  error?: string;
}

export const createRoom = (
  roomName: string,
  callback: (response: CreateRoomResponse) => void,
) => {
  if (roomName.trim()) {
    const roomId = `room_${Date.now()}`;

    socket.emit("create-room", roomId, (response: CreateRoomResponse) => {
      if (response.success && response.roomId) {
        callback(response);
      } else {
        console.error("Failed to create room:", response.error);
      }
    });
  }
};
