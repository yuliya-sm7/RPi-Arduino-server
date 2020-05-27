const info = document.getElementById('info');

const turn = document.getElementById("customSwitch3");
turn.addEventListener('click', (e) => {
    const data = { "led": e.target.checked }

    fetch('/led', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(data)
    }).then(res => res.text())
    .then((msg) => {
        info.value += msg + '\n';
        info.scrollTop = info.scrollHeight;
    });
});


const form = document.forms.namedItem('toArduino');
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = { 'command': form.command.value };
    fetch('/arduino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(data)
    }).then(res => res.text())
        .then((msg) => {
            info.value += msg + '\n';
            info.scrollTop = info.scrollHeight;
        });
    form.reset(); // очищаем поля формы 
});