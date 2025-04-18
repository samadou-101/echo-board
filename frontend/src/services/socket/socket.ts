import { io } from "socket.io-client";

const io_url = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://echo-board-oqis.onrender.com";
// const socket = io("http://localhost:3000");
const socket = io(io_url);

export default socket;
