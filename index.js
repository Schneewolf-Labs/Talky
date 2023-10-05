const WebSocket = require('ws');
const readline = require('readline');
const process = require('process');

const apiURL = 'ws://127.0.0.1:3000/api';
const username = 'Talky';

const ws = new WebSocket(apiURL);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

ws.on('open', () => {
    console.log('Connected to the server');

    // prompt for input
    promptForInput();
});

ws.on('message', (data) => {
    const message = JSON.parse(data);

    switch (message.event) {
        case 'receive_message':
            log('Received message: ' + message.data);
            break;
        case 'receive_image':
            log('Received image: ' + message.data);
            break;
        case 'receive_typing':
            log('Someone is typing...');
            break;
        default:
            log('Unknown event: ' + message.event);
    }
    promptForInput();
});

ws.on('close', () => {
    log('Disconnected from the server');
    process.exit();
});

ws.on('error', (error) => {
    console.error('WebSocket Error:', error);
});

function sendMessage(text) {
    const message = {
        author: username,
        text: text
    };

    ws.send(JSON.stringify({
        event: 'send_message',
        data: message
    }));

    // prompt for input
    promptForInput();
}

function promptForInput() {
    rl.question(`${username}: `, sendMessage);
}

function log(str) {
    // clear the current line
    readline.clearLine(process.stdout, 0);
    console.log(str);
}
