const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const dotenv = require("dotenv")
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { stringReplace } = require('string-replace-middleware');
const fs = require("fs");

dotenv.config()

var states = [];

app.get("/clickstate", (req, res) => {
  res.send(states);
});


app.get("/client.js", (req, res) => {
  fs.readFile("./public/client.js", 'utf8', (err, file) => {
    console.log(file);
     res.send(file.replace("CLIENTPORT", process.env.CLIENTPORT ? ":" + process.env.CLIENTPORT:"")
     .replace("SERVERURL", process.env.SERVERURL));
 });
});

app.use("/", express.static(__dirname + "/public"));

server.listen(process.env.PORT);
console.log("Your PORT via ENV:" + process.env.PORT);
console.log("Your SERVERURL via ENV:" + process.env.SERVERURL);

io.on("connection", (socket) => {
  console.log("Connected " + socket.id);
  console.log(states);
  sIndex = states.findIndex(s => s.id == socket.id);
  if(sIndex == -1) { //don't dupe existing sockets
    states.push({id:socket.id})
  }
  io.emit("getState", states);

  socket.on("distributeState", (state) => {
    sIndex = states.findIndex(s => s.id == state.id);
    console.log("distributeState!" + JSON.stringify(state) + " " + state.id + " " + sIndex);
    if(sIndex >= 0) {
      states[sIndex] = (state);
    }
    io.emit("getState", states);
  });

  socket.on("disconnect", () => {
    console.log("disconnected " + socket.id);
    sIndex = states.findIndex(s => s.id == socket.id);
    if(sIndex >= 0) {
      states.splice(sIndex, 1);
    }
    io.emit("getState", states);
  });

  socket.on("clearStates", (e) => {
    console.log("clearing States");
    states = [];
    io.emit("getState", states);
  });
});
