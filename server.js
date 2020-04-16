const express = require("express");
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const SerialPort = require("serialport");
const fs = require('fs');


//SERVER
const port = 8080;
server.listen(port);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/list_photos', function (req, res) {
  fs.readdir('./public/gallery/photo', function (err, items) {
    res.json({ list: items });
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
const IP = '192.168.1.103';
const LiveCam = require('./livecam2.js');
const webcam_server = new LiveCam({
  'ui_addr': IP,
  'ui_port': port + 1,
  'broadcast_addr': IP,
  'broadcast_port': 12000,
  'start': function () {
    console.log('WebCam server started!');
  }
});
webcam_server.broadcast();


let count = 0;
let take_photo = false;
const io_client = require('socket.io-client');
const io_webcam = io_client.connect("http://192.168.1.103:12000");
io_webcam.on('image', function (data) {
  if (take_photo) {
    take_photo = false;
    count++;
    io.emit("photo_count", count);
    decode_base64(data, String(count) + '.jpeg')
  }
});


let photo_counter = null;
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
    } else {
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
      fs.readdir('./public/gallery/photo', (err, files) => {
        if (err) console.log(err);
        files.forEach((file) => {
            fs.unlink(path.join('/public/gallery/photo', file), err => {
                if (err) console.log(err);
            });
        });
    });
      photo_counter = setInterval(function () { take_photo = true; }, 1000);
    } else {
      clearInterval(photo_counter);
    }
  })
});

function decode_base64(base64str, filename) {
  var buf = Buffer.from(base64str, 'base64');
  fs.writeFile(path.join(__dirname, '/public/gallery/photo/', filename), buf, function (error) {
    if (error) {
      throw error;
    } else {
      console.log('File created from base64 string!');
      return true;
    }
  });
}