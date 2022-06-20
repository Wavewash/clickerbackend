const socket = io.connect("https://clicky-backend.herokuapp.com/");

const statedisplay = document.getElementById("statedisplay");
const stateInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

var id;

socket.on("getState", message => {
  const messageItem = document.createElement("li");
  messageItem.innerText = message;
  statedisplay.appendChild(messageItem);
});

socket.on("registerId", myId => {
  id = myId;
})

sendButton.addEventListener("click", () => {
  const state = {"id":id, "value":stateInput.value};
  socket.emit("distributeState", state);
});

window.onload = function() {
  fetch("https://puffy-abiding-millennium.glitch.me/clickstate")
    .then(res => res.json())
    .then(clickerstates => {
      clickerstates.forEach(cstate => {
        const cstateItem = document.createElement("li");
        cstateItem.innerText = cstate;
        statedisplay.appendChild(cstateItem);
      });
    });
};
