import express from "express";
import { createServer } from "http";
import { setupSocket } from "realtime/socket";

const app = express();
const server = createServer(app);

setupSocket(server);

const PORT = 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
