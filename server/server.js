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
io.on("connection", function (socket) {
    console.log('User connected:', socket.id);
    
    socket.on("send-location", function (data) {
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
        io.emit('user-disconnected', socket.id);
    });
});

app.use('/api', (req, res) => {
    res.status(200).json({
        message: "hello SIH"
    });
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
