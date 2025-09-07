import express from "express";
import "./database/db.js";
import useroutes from "./routes/user.js";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

//CORS middleware for API routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

//middlewares
app.use(express.json());
app.use(cookieParser());

app.use("/api/user/", useroutes);

//socket
const connectedUsers = new Map(); // Store connected users and their locations

io.on("connection", function (socket) {
    console.log('User connected:', socket.id);

    // When a new user requests all current locations
    socket.on("request-all-locations", function () {
        const allLocations = {};
        connectedUsers.forEach((userData, userId) => {
            allLocations[userId] = userData;
        });
        socket.emit("all-locations", allLocations);
    });

    socket.on("send-location", function (data) {
        // Store the user's location
        connectedUsers.set(socket.id, {
            id: socket.id,
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy,
            safetyScore: data.safetyScore,
            timestamp: data.timestamp || new Date().toISOString()
        });

        // Broadcast to all clients
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("panic-alert", function (alertData) {
        console.log('Panic alert received:', alertData);
        // Broadcast to all connected clients (including dashboards)
        io.emit("panic-alert", {
            ...alertData,
            touristId: socket.id,
            timestamp: new Date().toISOString()
        });

        // Here you could also:
        // - Save to database
        // - Send SMS/email to authorities
        // - Trigger automated emergency response
    });

    socket.on("disconnect", function () {
        console.log('User disconnected:', socket.id);
        // Remove user from connected users
        connectedUsers.delete(socket.id);
        // Notify all clients
        io.emit('user-disconnected', socket.id);
    });
});

app.use('/api', (req, res) => {
    res.status(200).json({
        message: "hello SIH"
    });
});

const PORT=3000

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
