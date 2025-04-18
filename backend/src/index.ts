import express from "express";
import { createServer } from "http";
import { setupSocket } from "realtime/socket";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { db } from "@config/firebaseAdmin";
import canvasRoute from "@routes/api/canvasRoute";

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://echoboard-nine.vercel.app"],
  })
);
setInterval(() => {
  console.log("keeping the server awake");
  fetch("https://echo-board-oqis.onrender.com")
    .then((res) => console.log("Pinged server:", res.status))
    .catch((err) => console.error("Ping error:", err));
}, 60000 * 2);
// Routes
app.use("/api", canvasRoute);

// Setup Socket
setupSocket(server);

const PORT = 3000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
