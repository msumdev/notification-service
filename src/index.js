require('module-alias/register');

const WebSocket = require('ws');
const { createServer } = require('http');
const authMiddleware = require('@middleware/authMiddleware');
const handleConnection = require('@events/connection');
const redisService = require('@services/redisService');

const server = createServer();
const wss = new WebSocket.Server({ noServer: true });
wss.id = Math.random().toString(36).substring(2, 15);

redisService.setup(wss.id);

wss.on('connection', (ws) => { 
    ws.serverId = wss.id;

    handleConnection(ws);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        authMiddleware(wss, ws, request);
    })
});

server.listen(process.env.PORT, () => {
    console.log(`Websocket server started on port ${process.env.PORT}`);
})