const info = document.getElementById('info');

const light = document.getElementById("customSwitch3");
light.addEventListener('click', (e) => {
    const data = { "led": e.target.checked }
    fetch('/led', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(data)
    }).then(res => res.text())
        .then(msg => logg(msg));
});

const Arduino = document.getElementById('customSwitch1');
Arduino.addEventListener('click', (e) => {
    const data = { "serial": e.target.checked }
    fetch('/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(data)
    }).then(res => res.text())
        .then(msg => logg(msg));
});

let video = document.getElementById("video");
const camera = document.getElementById('customSwitch2');
camera.addEventListener('click', (e) => {
    if (e.target.checked) {
        video.src = "http://37.110.86.243:8081/";
        video.alt = "Ошибка камеры!";
    } else {
        video.src = "#";
        video.alt = "Камера отключена!";
    }
});

const form = document.forms.namedItem('toArduino');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    sendCommand(form.command.value);
    form.reset(); // очищаем поля формы 
});

function logg(msg) {
    info.value += msg + '\n';
    info.scrollTop = info.scrollHeight;
}


document.getElementById('joystick').addEventListener('click', (e) => {
    switch (e.target.id) {
        case 'forward':
            sendCommand("SetMotor 100 100 100\n");
            break;
        case 'left':
            sendCommand("SetMotor -200 200 100\n");
            break;
        case 'right':
            sendCommand("SetMotor 200 -200 100\n");
            break;
        case 'backward':
            sendCommand("SetMotor -100 -100 100\n");
            break;
        case 'stop':
            sendCommand("SetMotor 1 1 1\n");
            break;
    };
});

document.getElementById('joystick2').addEventListener('click', (evt) => {
    const dim = evt.target.getBoundingClientRect();
    const R = 25;
    const x = evt.clientX - dim.left - 45;
    const y = evt.clientY - dim.top - 45;
    let val = Math.atan2(y, x);
    const point = document.getElementById('angle_point');
    point.setAttribute('cx', R * Math.cos(val) + 30);
    point.setAttribute('cy', R * Math.sin(val) + 30);
    val = Math.round(val * 180 / Math.PI);
    sendCommand("cam:" + val);
    document.getElementById('angle_val').textContent = val;
});


document.getElementById('time').oninput = function () {
    this.labels[1].innerHTML = this.value;
}
document.getElementById('time').onchange = function () {
    sendCommand("time:" + this.value);
}

document.getElementById('speed').oninput = function () {
    this.labels[1].innerHTML = this.value;
}
document.getElementById('speed').onchange = function () {
    sendCommand("speed:" + this.value);
}


function sendCommand(str) {
    const data = { 'command': str };
    fetch('/arduino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(data)
    }).then(res => res.text())
        .then(msg => logg(msg));
}
