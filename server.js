const express = require("express");
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const SerialPort = require("serialport");
const fs = require('fs');


//HTTP SERVER
const IP = '192.168.1.103';
const port = 8080;
server.listen(port);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/list_photos', function (req, res) {
  fs.readdir('./public/gallery/photo', function (err, items) {
    res.json({ list: items });
    console.log(items);
  });
});


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
});
sp.on('close', function () {
  sp.write('654321\r');
  console.log("comm port close");
});


// CAMERA
const LiveCam = require('./livecam2.js');
const webcam_server = new LiveCam({
  'ui_addr': IP,
  'ui_port': port + 1,
  'broadcast_addr': IP,
  'broadcast_port': 12000,
  'webcam': { 'framerate': 10 }
});


let count = 0;
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
    if (turn) {
      webcam_server.broadcast();
    }else {
      webcam_server.kill();
    }
    socket.emit('log', "livecam on " + IP + ":" + String(port + 1) + (turn ? ' is open' : ' is close'));
  });

  socket.on('command', function (msg) {
    console.log(msg);
    // sp.write(msg);
    socket.emit('log', msg);
  });

  socket.on('scanning', function (turn) {
    if (turn) {
      count = 0;
      io.emit("photo_count", count);
      fs.readdir('./public/gallery/photo', (err, files) => {
        files.forEach((file) => {
          fs.unlink(path.join('./public/gallery/photo', file));
        });
      });
    }
  })

  socket.on('photo', function (data) {
    count++;
    const buf = Buffer.from(data, 'base64');
    const filename = String(count) + '.jpeg';
    fs.writeFile(path.join(__dirname, '/public/gallery/photo/', filename), buf);
    io.emit("photo_count", count);
  });

  socket.on('error', (error) => { console.log(error) })
});