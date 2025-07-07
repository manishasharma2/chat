const { log } = require("console");
const express = require("express");
const { chownSync, copyFileSync } = require("fs");
const http = require("http");

const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// io.on("connection", (socket) => {
//   console.log("Connection SUccessfull !! ", socket.id);

//   socket.broadcast.emit('newUser',socket.id)

//   socket.on("disconnect", () => {
//     console.log("User disconnected!!");
//   });
//  socket.on("drawing", (data) => {
//     // Broadcast the drawing data to all other clients
//     socket.broadcast.emit("drawing", data);
//   });

//   socket.on('clear',()=>{
//     socket.broadcast.emit('clear')
//   })
// });

io.on('connection',(socket) => {

  console.log("User Connected!!", socket.id)
  socket.broadcast.emit('newUser',socket.id)

  socket.on('joinRoom',(roomId)=>{
    socket.join(roomId)
    console.log(`${socket.id} joined room ${roomId}`)
  })

  socket.on('drawing',(data) => {
    io.to(data.roomId).emit('drawing',data)
  })

  socket.on('clear',(roomId)=>{
    io.to(roomId).emit('clear');
  })

  socket.on('disconnect',() => {
    console.log("user disconnected!!")
  })
})

server.listen(3000, () => {
  console.log("server is running on port 3000");
});
