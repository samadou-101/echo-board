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

// Routes
app.use("/api", canvasRoute);

// Setup Socket
setupSocket(server);

const PORT = 3000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
