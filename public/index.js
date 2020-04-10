const socket = io.connect(); //load socket.io-client and connect to the host

let live = null;

const turn = document.getElementById('customSwitch1');
turn.addEventListener('click', (e) => {
  document.getElementById('arduino').hidden = !e.target.checked;
  socket.emit("serial", e.target.checked); //send button state to server
});

const camera = document.getElementById('customSwitch2');
camera.addEventListener('click', (e) => {
  const livecam = document.getElementById('livecam');
  if (e.target.checked) {
    livecam.innerHTML = `<img id="video" src=""/>`;
    live = io.connect('http://192.168.1.102:12000');
    live.on('image', function (data) {
      document.getElementById("video").src = "data:image/jpeg;base64," + data;
    });
  } else {
    live.close();
    livecam.innerHTML = "";
  }
  socket.emit("livecam", e.target.checked); //send button state to server
});

const motor1 = document.getElementById('motor1');
motor1.addEventListener("input", function () {
  var target = document.getElementsByClassName('value')[0];
  target.innerHTML = motor1.value;
});
motor1.addEventListener('change', (e) => {
  socket.emit("command", "M1:" + motor1.value); //send button state to server
});

const motor2 = document.getElementById('motor2');
motor2.addEventListener("input", function () {
  var target = document.getElementsByClassName('value')[1];
  target.innerHTML = motor2.value;
});
motor2.addEventListener('change', (e) => {
  socket.emit("command", "M2:" + motor2.value); //send button state to server
});

function Send() {
  const angles = document.querySelector("#angles").value;
  console.log(angles);
  socket.emit("msg", angles);
}

socket.on('log', function (msg) {
  const info = document.getElementById('info');
  info.value += msg + '\n';
  info.rows += 1;
});