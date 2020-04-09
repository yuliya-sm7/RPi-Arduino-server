const express = require("express");
const app = require('express')();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const SerialPort = require("serialport");
app.use(express.static(path.join(__dirname, 'public')));

// SERIAL
const portName = '/dev/ttyACM0';
const sp = new SerialPort(portName, {
  baudRate: 115200,
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
  autoOpen: false
});
sp.on('error', err => {
  console.log(err.message);
})
sp.on('open', function () {
  const s = "comm port ready\r";
  sp.write(s);
  console.log(s);
  socket.emit();
});
sp.on('close', function () {
  sp.write('654321\r');
  console.log("comm port close");
});


//SERVER
server.listen(8080);
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


// WEBSOCKET
io.sockets.on('connection', function (socket) {
  socket.emit('test', { test: 'Its Working' });
  socket.on('serial', function (turn) {
    if (turn == true) {
      sp.open();
    } else {
      sp.close();
    }
    socket.emit('log', "port " + portName + (turn?' is open':' is close'));
  });
  socket.on('command', function (msg) {
    console.log(msg);
    // sp.write(msg);
    socket.emit('log', msg);
  });
});


// CAMERA
// const LiveCam = require('livecam');
// const webcam_server = new LiveCam({
//   'ui_addr': '192.168.1.102',
//   'ui_port': 8081,
//   'broadcast_addr': '192.168.1.102',
//   'broadcast_port': 12000,
//   'start': function () {
//     console.log('WebCam server started!');
//   }
// });
// webcam_server.broadcast();
