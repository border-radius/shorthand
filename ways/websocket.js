const WebSocket = require('ws');

function request (proxy, data) {
    return new Promise ((resolve, reject) => {
        var socket = new WebSocket(proxy);
        socket.onerror = reject;
        socket.onopen = () => {
            socket.send(JSON.stringify(data));
        };
        socket.onmessage = e => {
            socket.close();
            resolve(JSON.parse(e.data));
        };
    });
}

function response (evaluate) {
    return ws => {
        ws.on('message', data => {
            evaluate(JSON.parse(data)).then(answer => ws.send(JSON.stringify(answer)));
        });
    };
}

exports.request = request;
exports.response = response;
