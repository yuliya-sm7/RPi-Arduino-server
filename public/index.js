const socket = io.connect(); //load socket.io-client and connect to the host

let live = null;
let video = document.getElementById("video");

const turn = document.getElementById('customSwitch1');
turn.addEventListener('click', (e) => {
  socket.emit("serial", e.target.checked); //send button state to server
});

let scaning = false;
let photo_counter = null;
const photo_count = document.getElementById('photo_count');
const scan = document.getElementById('scan');
scan.addEventListener('click', () => {
  scan.classList.toggle('btn-outline-primary');
  scan.classList.toggle('btn-primary');
  if (scaning) {
    scan.innerText = "Начать";
    clearInterval(photo_counter);
  } else {
    scan.innerText = "Закончить";
    photo_count.innerHTML = 0;
    photo_counter = setInterval(function () { photo_count.innerHTML = parseInt(photo_count.innerHTML) + 1 }, 2000);
  }
  scaning = !scaning;
});

const camera = document.getElementById('customSwitch2');
camera.addEventListener('click', (e) => {
  if (e.target.checked) {
    live = io.connect('http://192.168.1.102:12000');
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

const motor1 = document.getElementById('motor1');
motor1.addEventListener("input", function () {
  var target = document.getElementsByClassName('value')[1];
  target.innerHTML = motor1.value;
});
motor1.addEventListener('change', (e) => {
  socket.emit("command", "M1:" + motor1.value); //send button state to server
});

const motor2 = document.getElementById('motor2');
motor2.addEventListener("input", function () {
  var target = document.getElementsByClassName('value')[2];
  target.innerHTML = motor2.value;
});
motor2.addEventListener('change', (e) => {
  socket.emit("command", "M2:" + motor2.value); //send button state to server
});


document.getElementById('clean').addEventListener('click', () => { document.getElementById('info').value = "" })

socket.on('log', function (msg) {
  const info = document.getElementById('info');
  info.value += msg + '\n';
  info.scrollTop = info.scrollHeight;
});