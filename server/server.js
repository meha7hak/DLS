import dotenv from "dotenv";
dotenv.config({ path: "./DLS.env" });
import app from "./app.js";
import connectDB from "./config/db.js";

import http from "http";
import { Server } from "socket.io";

connectDB();

const PORT = process.env.PORT || 6000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // allow all basics or specify later
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    }
});

// Make io accessible in controllers
app.set('io', io);

io.on('connection', (socket) => {
    console.log('A user connected via Socket.IO:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
