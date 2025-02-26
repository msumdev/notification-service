const jwt = require('jsonwebtoken');
const ConnectionManager = require('@utils/connectionManager');
const redisService = require('@services/redisService');

module.exports = (wss, ws, request, next) => {
  const token = request.url.split('token=')[1];
  const ipAddress = request.connection.remoteAddress;
  const ipv4Address = ipAddress.startsWith('::ffff:') ? ipAddress.split('::ffff:')[1] : ipAddress;
  const connectionManager = new ConnectionManager();

  if (!token) {
    ws.close(1008, 'Unauthorized');
    return;
  }

  try {
    const base64Decoded = Buffer.from(token, 'base64').toString();
    const { userId, ipAddress, tabId, expiresAt } = jwt.verify(base64Decoded, atob(process.env.JWT_SECRET));

    if (ipv4Address !== ipAddress && process.env.NODE_ENV != 'development') {
      ws.close(1008, 'Unauthorized');
      return;
    }

    if (expiresAt * 1000 < Date.now() && process.env.NODE_ENV != 'development') {
      ws.close(1008, 'Unauthorized');
      return;
    }

    connectionManager.addConnection(userId, ws);
    redisService.incrementConnectionCountForUser(userId);

    ws.userId = userId;

    wss.emit('connection', ws);
  } catch (error) {
    console.log(`An error occurred: ${error.message}`);

    ws.close(1008, 'Unauthorized');
    return;
  }
};