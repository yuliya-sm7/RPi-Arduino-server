const LiveCam = require('livecam');
const webcam_server = new LiveCam({
    'ui_addr' : '192.168.1.105',
    'ui_port' : 8081,
    'broadcast_addr' : '192.168.1.105',
    'broadcast_port' : 12000,
    'gst_tcp_addr' : '192.168.1.105',
    'gst_tcp_port' : 10000,
    
    'start' : function() {
        console.log('WebCam server started!');
    }
});

webcam_server.broadcast();