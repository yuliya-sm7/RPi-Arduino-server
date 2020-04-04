var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var SerialPort = require("serialport");

//SERIAL
var portName = '/dev/ttyACM0';
var sp = new SerialPort(portName, {
   baudRate: 115200,
   dataBits: 8,
   parity: 'none',
   stopBits: 1,
   flowControl: false
}); // instantiate the serial port.
sp.on("open", function () {
     sp.write('123456\r');
     console.log ("comm port ready");
  });

//SERVER
server.listen(8080);

app.get('/', function (req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket){
  socket.emit('test', { test: 'Its Working' });
  socket.on('msg', function (data){
    console.log(data);
    sp.write(data);
    });
});
