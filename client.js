var socket = io.connect(); //load socket.io-client and connect to the host
function LEDToggle(check) {
    console.log(check.checked);
    socket.emit("state", check.checked); //send button state to server
}
function Send() {
    const angles = document.querySelector("#angles").value;
    console.log(angles);
    socket.emit("msg", angles);
}