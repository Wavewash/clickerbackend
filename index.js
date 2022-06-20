const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const states = [];

app.get("/clickstate", (req, res) => {
  res.send(states);
});

app.use("/", express.static(__dirname + "/public"));

server.listen(process.env.PORT);

io.on("connection", socket => {
  let id = socket.id;
  io.emit("registerId", id);
  
  socket.on("distributeState", state => {
    console.log("distributeState!");
    states.push(JSON.stringify(state));
    io.emit("getState", states);
  });
});