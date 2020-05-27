const express = require("express");
const app = express();
var bodyParser = require('body-parser');
const SerialPort = require("serialport");


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
sp.on('error', err => { console.log(err.message); })
sp.on('open', function () {
    const s = "comm port ready\r";
    sp.write(s);
    console.log(s);
});

sp.on('data', msg => console.log(msg + ' from serial'))
sp.on('close', function () { console.log("comm port close"); });

//HTTP SERVER
const port = 3141;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json())
app.listen(port);
app.post('/led', function (req, res) {
    const turn = req.body.led;
    console.log(turn)
    res.send(turn?"ВКЛ":"ВЫКЛ")
});
app.post('/arduino', function (req, res) {
    const command = req.body.command;
    console.log(command);
    sp.write(command + '\n');
    res.send(command + ' send to Arduino')
});