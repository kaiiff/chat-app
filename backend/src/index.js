const express = require("express");
const app = express();
const { config } = require("dotenv");
config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const chats = require("./data/data");
const path = require("path");
const bodyParser = require("body-parser")
const userRoutes = require("./routers/userRouter");
const chatRoutes = require("./routers/chatRouter");
const messageRoutes = require("./routers/messageRouter")

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

app.use("/api", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message",messageRoutes)

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server start on port successfully: ${port}`);
});
