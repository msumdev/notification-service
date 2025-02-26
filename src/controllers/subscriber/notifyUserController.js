const ConnectionManager = require('@utils/connectionManager');

module.exports = {
    async notify(data) {
        try {
            const { userId, payload } = data;
            const connectionManager = new ConnectionManager();

            connectionManager.notify(userId, payload);
        } catch (error) {
            console.error(error);
        }
    }
}