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


function sendCommand(str) {
    const data = { 'command': str };
    fetch('/arduino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(data)
    }).then(res => res.text())
        .then(msg => logg(msg));
}