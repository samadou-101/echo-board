import socket from "@services/socket/socket";
import { useEffect } from "react";

export const useSocketConnection = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with ID " + socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);
};
