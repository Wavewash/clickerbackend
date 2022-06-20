const serverUrl = "https://clicky-backend.herokuapp.com";

const myid = document.getElementById("myid");
const statedisplay = document.getElementById("statedisplay");
const stateInput = document.getElementById("message-input");
const sendForm = document.getElementById("send-form");
const clearBtn = document.getElementById("clearBtn");

function clearAndRender(states) {
  statedisplay.innerHTML = "";
  states.forEach((message) => {
    const messageItem = document.createElement("li");
    messageItem.innerText = JSON.stringify(message);
    statedisplay.appendChild(messageItem);
  });
}

const socket = new io(serverUrl);
socket.on("getState", (states) => {
  console.log(states);
  clearAndRender(states);
});



socket.on("connect", () => {
  console.log("connected");
  myid.textContent = socket.id;
})


sendForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const state = { id: socket.id, value: stateInput.value };
  socket.emit("distributeState", state);

  stateInput.value = "";
});

clearBtn.addEventListener("click", (e) => {
  console.log("clear");
  socket.emit("clearStates", true);
});

window.onload = function () {
  fetch(serverUrl + "/clickstate")
    .then((res) => res.json())
    .then((states) => {
      clearAndRender(states);
    });
};
