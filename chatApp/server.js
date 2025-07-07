const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const Message = require("./model/message");
const { connect } = require("http2");
const connectDB = require("./db");

require('dotenv').config();

//connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const socketId_to_username = new Map();

io.on("connection", async(socket) => {
  console.log("Socket connected:");
  const userId = socket.id;

  const previousChatHistory = await Message.find({})
  socket.emit('chat-history',previousChatHistory)
  socket.on("message", async (msg, name) => {
    const newMessage = new Message({
      username: name,
      content: msg,
      timestamp: new Date()
    });
    await newMessage.save();
    console.log(`${name} : ${msg}`);
    socketId_to_username.set(userId, name);
    console.log(socketId_to_username);
    io.emit("msg", msg, name);
  });

  io.emit("newUser", userId);
  socket.on("register", (username) => {
    socketId_to_username.set(userId,username);
    io.emit("register_username", socketId_to_username.get(socket.id));
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected !!", userId);
    var name = socketId_to_username.get(socket.id)
    socketId_to_username.delete(socket.id)
    io.emit("user-left", name);
  });
});

console.log(socketId_to_username);
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
                                        