const express = require("express");
const app = express();
const { config } = require("dotenv");
config();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const http = require("http"); 
const { Server } = require("socket.io");

const port = process.env.PORT || 5000;
const userRoutes = require("./routers/userRouter");
const chatRoutes = require("./routers/chatRouter");
const messageRoutes = require("./routers/messageRouter");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Database connection calling
const Database = require("./utils/connection");
Database();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: false,
  })
);

// Create the HTTP server and wrap the Express app
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Join a chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`Client ${socket.id} joined chat: ${chatId}`);
  });

  // Listen for new messages
  socket.on("sendMessage", (newMessage) => {
    const chatId = newMessage.chat._id;
    io.to(chatId).emit("messageReceived", newMessage);
  });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Middleware to add `io` to the request object
app.use("/api/message", (req, res, next) => {
  req.io = io;
  next();
}, messageRoutes);

app.use("/api", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

// Start the server
server.listen(port, () => {
  console.log(`Server started successfully on port: ${port}`);
});
