import express from "express";
import "./database/db.js";
import useroutes from "./routes/user.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5000", // frontend origin
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// ✅ Proper CORS middleware
app.use(cors({
    origin: "http://localhost:3001", // your React dev server
    credentials: true,               // allow cookies
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/user", useroutes);

// Example test route
app.get("/api", (req, res) => {
    res.status(200).json({ message: "hello SIH" });
});

// Socket.IO
const connectedUsers = new Map();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("request-all-locations", () => {
        const allLocations = {};
        connectedUsers.forEach((userData, userId) => {
            allLocations[userId] = userData;
        });
        socket.emit("all-locations", allLocations);
    });

    socket.on("send-location", (data) => {
        connectedUsers.set(socket.id, {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy,
            safetyScore: data.safetyScore,
            timestamp: data.timestamp || new Date().toISOString(),
        });
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("panic-alert", (alertData) => {
        console.log("Panic alert received:", alertData);
        io.emit("panic-alert", {
            ...alertData,
            touristId: socket.id,
            timestamp: new Date().toISOString(),
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        connectedUsers.delete(socket.id);
        io.emit("user-disconnected", socket.id);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
