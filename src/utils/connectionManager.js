module.exports = class ConnectionManager {
  static connections = [];

  addConnection(userId, ws) {
    if (!ConnectionManager.connections[userId]) {
      ConnectionManager.connections[userId] = [];
    }

    ConnectionManager.connections[userId] = [...ConnectionManager.connections[userId], ws];
  }

  removeConnection(userId, ws) {
    if (ConnectionManager.connections[userId]) {
      ConnectionManager.connections[userId] = ConnectionManager.connections[userId].filter((connection) => connection !== ws);
      
      if (ConnectionManager.connections[userId].length === 0) {
        delete ConnectionManager.connections[userId];
      }
    } else {
      console.warn(`No connections found for userId: ${userId}`);
    }
  }  

  getConnections(userId) {
    return ConnectionManager.connections[userId] ?? [];
  }

  getAllConnections() {
    return ConnectionManager.connections;
  }

  notify(userId, payload) {
    const connections = this.getConnections(userId);
    const message = JSON.stringify(payload);

    console.log(`Trying to notify ${userId}`)
    console.log(`Notifying ${connections.length} users`);

    this.getConnections(userId).forEach(ws => {
      ws.send(message);
    });
  }
};