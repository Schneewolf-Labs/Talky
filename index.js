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
    rl.question('Enter message: ', sendMessage);
});

ws.on('message', (data) => {
    const message = JSON.parse(data);

    switch (message.event) {
        case 'receive_message':
            console.log('Received message:', message.data);
            break;
        case 'receive_image':
            console.log('Received image:', message.data);
            break;
        case 'receive_typing':
            console.log('Someone is typing...');
            break;
        default:
            console.log('Unknown event:', message.event);
    }
});

ws.on('close', () => {
    console.log('Disconnected from the server');
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
    rl.question('Enter message: ', sendMessage);
}
