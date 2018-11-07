function connectWebSocket() {
    var socket = new WebSocket('ws://vhost3.lnu.se:20080/socket/');
    socket.addEventListener('message', function(event) {
        console.log('message receieve')
    });

    socket.addEventListener('close', function(e) {
        console.log('connection closed');
    });
    return socket;
}
