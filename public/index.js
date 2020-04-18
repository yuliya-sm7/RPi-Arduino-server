const socket = io.connect(); //load socket.io-client and connect to the host

const turn = document.getElementById('customSwitch1');
turn.addEventListener('click', (e) => {
  socket.emit("serial", e.target.checked); //send button state to server
});


const photo_count = document.getElementById('photo_count');
socket.on('photo_count', function (c) {
  photo_count.innerHTML = c;
});

let scaning = false;
photo_count.addEventListener('click', () => { window.location = '/gallery/' });
const scan = document.getElementById('scan');
scan.addEventListener('click', () => {
  scan.classList.toggle('btn-outline-primary');
  scan.classList.toggle('btn-primary');
  if (scaning) {
    scan.innerText = "Начать сканирование";
  } else {
    scan.innerText = "Закончить сканирование";
    photo_count.innerHTML = 0;
  }
  scaning = !scaning;
  socket.emit("scanning", scaning);
});


let live = null;
let video = document.getElementById("video");
const camera = document.getElementById('customSwitch2');
camera.addEventListener('click', (e) => {
  if (e.target.checked) {
    live = io.connect('http://192.168.1.103:12000');
    live.on('image', function (data) {
      video.src = "data:image/jpeg;base64," + data;
    });
  } else {
    live.close();
  }
  socket.emit("livecam", e.target.checked); //send button state to server
});

const light = document.getElementById('customSwitch3');
light.addEventListener('click', () => {
  video.classList.toggle('light');
});


const slider = document.getElementsByClassName('range-slider');
Array.from(slider).forEach((item) => {
  item.children[0].addEventListener('input', () => {
    item.children[1].innerHTML = item.children[0].value;
  })
})

const motor1 = document.getElementById('motor1');
motor1.addEventListener('change', (e) => {
  socket.emit("command", "M1:" + motor1.value); //send button state to server
});

const motor2 = document.getElementById('motor2');
motor2.addEventListener('change', (e) => {
  socket.emit("command", "M2:" + motor2.value); //send button state to server
});


const info = document.getElementById('info');
socket.on('log', function (msg) {
  info.value += msg + '\n';
  info.scrollTop = info.scrollHeight;
});
document.getElementById('clean').addEventListener('click', () => { document.getElementById('info').value = "" })