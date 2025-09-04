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

//middlewares
app.use(express.json());
app.use(cookieParser());

app.use("/api/user/", useroutes);

//socket
io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    
    socket.on("disconnect", function () {
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
