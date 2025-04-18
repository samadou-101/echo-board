"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_1 = require("./realtime/socket");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const canvasRoute_1 = __importDefault(require("./routes/api/canvasRoute"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://echoboard-nine.vercel.app"],
}));
setInterval(() => {
    console.log("keeping the server awake");
    fetch("https://echo-board-oqis.onrender.com")
        .then((res) => console.log("Pinged server:", res.status))
        .catch((err) => console.error("Ping error:", err));
}, 60000 * 2);
// Routes
app.use("/api", canvasRoute_1.default);
// Setup Socket
(0, socket_1.setupSocket)(server);
const PORT = 3000;
server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
