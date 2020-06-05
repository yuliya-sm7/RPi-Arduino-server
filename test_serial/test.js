const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const SerialPort = require("serialport");
const gpiop = require('rpi-gpio').promise;
const cobs = require('cobs');


//GPIO
gpiop.setup(37, gpiop.DIR_OUT)
gpiop.setup(40, gpiop.DIR_OUT)


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
sp.on('error', err => console.log(err.message))
sp.on('open', () => {
    console.log("COM port ready")
    sp.write("TestMode On\n")
});
sp.on('data', msg => console.log("From serial: " + msg))
sp.on('close', () => console.log("COM port close"));
sp.open();


//HTTP SERVER
const port = 3141;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.listen(port);
app.post('/led', function (req, res) {
    const turn = req.body.led;
    gpiop.write(37, turn);
    gpiop.write(40, turn);
    res.send(turn ? "ВКЛ" : "ВЫКЛ")
});
app.post('/init', function (req, res) {
    const init = req.body.serial;
    init ? sp.open() : sp.close();
    res.send("Serial is " + (init ? "open" : "close"))
});
app.post('/arduino', function (req, res) {
    const command = req.body.command;
    if (command.indexOf('cam') != -1) {
        const val = command.split(':')[1];
        let buffer = new Uint8Array(5);
        buffer[0] = 112;
        switch (val) {
            case '0':
                buffer[1] = 1;
                buffer[2] = 1;
                buffer[3] = 1;
                buffer[4] = 1;
                break;
            case '90':
                buffer[1] = 1;
                buffer[2] = 3;
                buffer[3] = 180;
                buffer[4] = 66;
                break;
            case '180':
                buffer[1] = 1;
                buffer[2] = 3;
                buffer[3] = 52;
                buffer[4] = 67;
                break;
            case '270':
                buffer[1] = 1;
                buffer[2] = 3;
                buffer[3] = 135;
                buffer[4] = 67;
                break;
        }
        res.send(buffer + ' send to Cam');
        buffer = cobs.encode(buffer);
        sp.write(buffer);
    }
    else {
        sp.write(command);
        res.send(command + ' send to Robot')
    }
});
