import socket from "./socket";

interface RoomResponse {
  success: boolean;
  roomId?: string;
  error?: string;
}

export const createRoom = (
  roomName: string,
  callback: (response: RoomResponse) => void,
) => {
  if (roomName.trim()) {
    const roomId = `room_${Date.now()}`;
    socket.emit("create-room", roomId, callback);
  } else {
    callback({ success: false, error: "Room name is required" });
  }
};

export const joinRoom = (
  roomId: string,
  callback: (response: RoomResponse) => void,
) => {
  if (roomId.trim()) {
    socket.emit("join-room", roomId, callback);
  } else {
    callback({ success: false, error: "Invalid room ID" });
  }
};

export const requestUsersInRoom = (roomId: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    socket.emit("request-users-in-room", roomId);

    socket.once("room-users", (users: string[]) => {
      resolve(users);
    });

    setTimeout(() => {
      reject(new Error("Request for room users timed out"));
    }, 5000);
  });
};
