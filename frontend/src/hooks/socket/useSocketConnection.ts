import socket from "@services/socket/socket";
import { useEffect, useState } from "react";

export const useSocketConnection = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (socket.connected) {
      setUserId(socket.id ?? null);
    }

    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
      setUserId(socket.id ?? null);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server, ID:", socket.id);
    });

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return userId;
};
