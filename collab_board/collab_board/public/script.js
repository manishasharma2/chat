const canvas = document.getElementById("whiteBoard");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

ctx.strokeStyle = "#000000";
ctx.lineWidth = 5;
ctx.lineCap = "round";

//lets Draw on whiteBoard

let isDrawing = false;

//start drawing when mouse is pressed
//when you place your pen on paper to draw
canvas.addEventListener('mousedown',(e)=>{
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX,e.clientY);
    socket.emit("drawing", {
        roomId: currentRoomId,
        type: "begin",
        x: e.clientX,
        y: e.clientY,
        color: ctx.strokeStyle,
        size: ctx.lineWidth
    });
})

//draw while mouse moves(if holding click)
//when you move your pen on paper
canvas.addEventListener('mousemove',(e)=>{
    if(!isDrawing) return;

    ctx.lineTo(e.clientX,e.clientY);
    ctx.stroke();
    socket.emit("drawing", {
        roomId: currentRoomId,
        type: "draw",
        x: e.clientX,
        y: e.clientY,
        color: ctx.strokeStyle,
        size: ctx.lineWidth
    });
})

//stop drawing when mouse is released
// when you take off your pen from
canvas.addEventListener('mouseup',(e)=>{
    isDrawing = false;
})

//stop drawing if mouse leaves canvas(whiteBoard)
canvas.addEventListener('mouseout',()=>{
    isDrawing = false;
})

//change brush color
const colorPicker = document.getElementById('colorPicker');

colorPicker.addEventListener('change',(e) => {
    ctx.strokeStyle = e.target.value;
})
//adjust brush size
const brushSize = document.getElementById('brushSize')

brushSize.addEventListener('change',(e)=>{
    ctx.lineWidth = e.target.value;
})
//clear canvas
const clearBtn = document.getElementById('clearBtn');
clearBtn.addEventListener('click',()=> {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    socket.emit('clear',currentRoomId)
})

//sokcet IO code

const socket = io("http://localhost:3000", {
  transports: ["websocket"], // optional, can help with connection issues
});

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

socket.on('newUser',(data)=>{
    console.log(`New user joined with Id: ${data}`)
})

socket.on("drawing", (data) => {
    
    if (data.type === "begin") {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.size;
        ctx.beginPath();
        ctx.moveTo(data.x, data.y);
    } else if (data.type === "draw") {
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
    }
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clear");
});

socket.on("clear", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

let currentRoomId = null;
const joinBtn = document.getElementById('joinBtn')

joinBtn.addEventListener('click',() => {
    const roomId = document.getElementById('roomInput').value
    if(!roomId) return alert('Please enter room Id')

    currentRoomId = roomId;

    socket.emit('joinRoom', roomId)
    console.log(`joined room: ${roomId}`)
})