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
// const IP = '192.168.1.102';
// const LiveCam = require('./livecam2.js');
// const webcam_server = new LiveCam({
//   'ui_addr': IP,
//   'ui_port': port + 1,
//   'broadcast_addr': IP,
//   'broadcast_port': 12000,
//   'start': function () {
//     console.log('WebCam server started!');
//   }
// });
// webcam_server.broadcast();


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
    socket.emit('log', "livecam on " + IP + ":" + port + (turn ? ' is open' : ' is close'));
  });
  socket.on('command', function (msg) {
    console.log(msg);
    // sp.write(msg);
    socket.emit('log', msg);
  });
  let photo_counter = null;
  let count = null;
  socket.on('scanning', function (turn) {
    if (turn) {
      count = 0;      
      photo_counter = setInterval(function () {
        count++;
        socket.emit("photo_count", count);
        decode_base64("data:image/jpeg;base64," + "aaaaaaaa", String(count) + '.jpeg')
      }, 2000);
    } else {
      clearInterval(photo_counter);
    }
  })
});

function decode_base64(base64str , filename){
  var buf = Buffer.from(base64str,'base64');
  fs.writeFile(path.join(__dirname,'/public/gallery/photo/',filename), buf, function(error){
    if(error){
      throw error;
    }else{
      console.log('File created from base64 string!');
      return true;
    }
  });
}