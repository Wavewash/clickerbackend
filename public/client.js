const serverUrl = "https://tr5qqn.sse.codesandbox.io/";

const socket = new io.Socket();
socket.on("getState", (states) => {
  console.log("getState");
  statedisplay.innerHTML = "";
  states.forEach((message) => {
    const messageItem = document.createElement("li");
    messageItem.innerText = message;
    statedisplay.appendChild(messageItem);
  });
});
//socket.connect(serverUrl);

const myid = document.getElementById("myid");
const statedisplay = document.getElementById("statedisplay");
const stateInput = document.getElementById("message-input");
const sendForm = document.getElementById("send-form");
const clearBtn = document.getElementById("clearBtn");

sendForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const state = { id: socket.id, value: stateInput.value };
  socket.emit("distributeState", state);

  myid.textContent = socket.id;
  stateInput.value = "";
});

clearBtn.addEventListener("click", (e) => {
  console.log("clear");
  socket.emit("clearStates", true);
});

window.onload = function () {
  fetch(serverUrl)
    .then((res) => res.json())
    .then((clickerstates) => {
      clickerstates.forEach((cstate) => {
        const cstateItem = document.createElement("li");
        cstateItem.innerText = cstate;
        statedisplay.appendChild(cstateItem);
      });
    });
};
