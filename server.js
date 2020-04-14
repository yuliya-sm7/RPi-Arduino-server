const express = require("express");
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const SerialPort = require("serialport");
const fs = require('fs');


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
const port = 8080;
server.listen(port);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/list_photos', function (req, res) {
  fs.readdir('./public/gallery/photo', function (err, items) {
    res.json({ list: items });
  });
});

// CAMERA
const IP = '192.168.1.102';
const LiveCam = require('./livecam2.js');
let webcam_server = undefined;

// WEBSOCKET
io.sockets.on('connection', function (socket) {
  socket.on('serial', function (turn) {
    if (turn == true) {
      sp.open();
    } else {
      sp.close();
    }
    socket.emit('log', "port " + portName + (turn ? ' is open' : ' is close'));
  });
  socket.on('livecam', function (turn) {
    if (turn == true) {
      webcam_server = new LiveCam({
        'ui_addr': IP,
        'ui_port': port + 1,
        'broadcast_addr': IP,
        'broadcast_port': 12000,
        'start': function () {
          console.log('WebCam server started!');
        }
      });
      webcam_server.broadcast();
    } else {

    }
    socket.emit('log', "livecam on " + IP + ":" + port + (turn ? ' is open' : ' is close'));
  });
  socket.on('command', function (msg) {
    console.log(msg);
    // sp.write(msg);
    socket.emit('log', msg);
  });
});