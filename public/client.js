const message = document.getElementById("message");
const username = document.getElementById("username");
const messageBox = document.querySelector(".message-box");
// const room = document.getElementById('room')

let currentUser;
const socket = io("http://localhost:8000", {
  transports: ["websocket"], // optional, can help with connection issues
});

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

socket.on("user-left", (data) => {
  const leftMsg = document.createElement("p");
  leftMsg.textContent = `${data} Left the Chat at ${time}`;
  leftMsg.classList.add("system-message");
  messageBox.appendChild(leftMsg);
});

socket.on("register_username", (data) => {
  console.log(`New User has joined with Id: ${data}`);
  const joinedMsg = document.createElement("p");
  joinedMsg.textContent = `${data} Joined  at ${time}`;
  joinedMsg.classList.add("system-message");
  messageBox.appendChild(joinedMsg);
});

socket.on("msg", (msg, name) => {
  console.log(`${name} : ${msg}`);
  const msgElement = document.createElement("p");
  if (name === currentUser) {
    msgElement.textContent = `[${time}] You : ${msg}`;
  } else {
    msgElement.textContent = `[${time}] ${name}: ${msg}`;
  }
  if (name === currentUser) {
    msgElement.classList.add("my-message");
  } else {
    msgElement.classList.add("other-message");
  }
  messageBox.appendChild(msgElement);
  messageBox.scrollTop = messageBox.scrollHeight;
});

socket.on('chat-history',(messages) => {
  messages.forEach((msg) => {
    const msgElement = document.createElement('p')
    msgElement.textContent = `${msg.username} : ${msg.content}`
    messageBox.appendChild(msgElement)
  });
})

function handleSendBtn() {
  socket.emit("message", message.value, username.value);
  message.value = "";
  // username.value = ''
}

function handleRegisterBtn() {
  currentUser = username.value;
  socket.emit("register", username.value);
}

const time = new Date().toLocaleTimeString([], {
  hour: "2-digit",
  minute: "2-digit",
});
