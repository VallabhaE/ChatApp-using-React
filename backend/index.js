import express from "express";
import { Server } from 'socket.io';
import { createServer } from "http";
import cors from "cors";
import { addUser,checkUser, Users } from "./Users/user.js";
import cookieParser from "cookie-parser";
const MESSAGES = []
const PORT = 3000;
const userSocketMap = {}; // {userId->socketId}
const app = express();
const server = createServer(app);

// Middleware to parse JSON body
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(cookieParser());


// CORS configuration allowing only specific origin
app.use(cors({
    origin: ['http://localhost:5173'], // Allow requests from this origin
    methods:["GET","POST"],
    credentials:true
}));

const io = new Server(server, {
    cors: {
        origin: "*", // Accept any origin for Socket.IO
    }
});



app.post("/login", (req, res) => {
    const { userName, password } = req.body;
    console.log(userName,password);
    const success = checkUser(userName, password)

    if(success===undefined) return res.status(401).json({message:"User Not Exist"});
    const tokenData = {
        id:success.id
    }
    return res.status(200).cookie("token", tokenData, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
        username: success.username,
        id:success.id,
        email:success.email
    });
});
app.post("/signup", (req, res) => {
    const { userName, email, password } = req.body;
    console.log(userName,email,password);
    const success = addUser(userName, email, password)
    if(success === 1) return res.status(401).json({message:"Error Creating UserName, Exists"});
    if(success === 2) return res.status(402).json({message:"Email already exists"});
    return res.status(200).json({ message: "User Has Created" });
});


app.get("/getChatData/:receverId/:senderId", (req, res) => {
    const { receverId,senderId } = req.params; // Extract user ID from the route parameter
    console.log(`a: ${receverId}`);
    console.log("b",senderId)

    // Convert `id` to a number for proper comparison
    const user = Users.find((u) => u.id === Number(receverId) ||  u.id === Number(senderId));
    if (!user) {
        return res.status(403).json({ message: "User not found" });
    }

    // Filter messages relevant to the user
    const userMessages = MESSAGES.filter(
        (msg) => msg.senderId === Number(receverId) || msg.receiverId === Number(receverId) ||msg.senderId === Number(senderId) || msg.receiverId === Number(senderId)
    );

    return res.status(200).json({
        senderId,receverId,

        messages: userMessages,
    });
});


io.on("connection", (socket) => {
    console.log("Server is running on port", socket.id);

    // Map userId to socketId
    userSocketMap[socket.handshake.query.userId] = socket.id;
    io.emit("users", Users);
    io.emit("allMessages",MESSAGES) 



    // Listen for 'message' event from client
    socket.on("message", (d) => {
        const { senderId, receiverId, message } = d;
        
        console.log(d)
        // Validate message structure
        if (senderId === undefined || receiverId === undefined || !message.trim()) {
            console.log("Invalid message data received");
            return;
        }
    
        // Add the new message to the MESSAGES array
        const messageObj = {
            senderId,
            receiverId,
            message,
            timestamp: new Date().toISOString() // Optional: Add a timestamp
        };

        MESSAGES.push(messageObj);
        console.log(MESSAGES)

        // Filter all messages relevant to the receiver
        const relevantMessages = MESSAGES.filter(
            (msg) => msg.senderId === receiverId || msg.receiverId === receiverId
        );

        // Emit the entire conversation (relevant messages) to the receiver
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("personal", relevantMessages);
        }

        // Emit confirmation to sender
        socket.emit("message_sent", { status: "Message delivered" });

        console.log("Updated MESSAGES array:", MESSAGES);
    });

    // Handle disconnect event
    socket.on("disconnecting", () => {
        console.log(`User is disconnecting: ${socket.id}`);
    });
});


// Start the server
server.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
