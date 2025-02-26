const redisService = require('@services/redisService');
const ConnectionManager = require('@utils/connectionManager');

module.exports = (ws) => {
    console.log('New client connected');

    const connectionManager = new ConnectionManager();

    ws.on('message', async (message) => {
        // do nothing because we do not want the user to send data
    });    

    ws.on('close', () => {
        connectionManager.removeConnection(ws);
        redisService.decrementConnectionCountForUser(ws.userId);
    })
}