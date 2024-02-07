import express from "express";
import morgan from "morgan";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoutes.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { Server } from "socket.io";
import path from "path";

// Dotenv Config
dotenv.config();
// Connect to MongoDB
connectDB();
// Middleware
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/messages", messageRoute);

// ----------------------Deployment--------------->

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/"),
    (req, res) => {
      res.send("API is running successfully!");
    };
}

// ----------------------Deployment--------------->

// Rest API

app.use("/", (req, res) => {
  res.send("Server is running!");
});

// Listen
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(` Server is running on Port ${PORT}`.bgGreen.white);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io server!");
  // Connect User
  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });

  // Join Chat
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User join room:", room);
  });

  // Typing
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  // Send Message
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat.users) return console.log("Chat.users not defined!");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  // Turn off Socket
  socket.off("setup", () => {
    console.log("User Disconnected!");
    socket.leave(userData.id);
  });
});
