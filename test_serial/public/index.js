const turn = document.getElementById("customSwitch3");
turn.addEventListener('click', (e) => {
    const data = { "led": e.target.checked }

    fetch('/led', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(data)
    });
});

const turn = document.getElementById("SEND");
turn.addEventListener('click', (e) => {
    
    const data = { "input":  }

    fetch('/led', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(data)
    });
});