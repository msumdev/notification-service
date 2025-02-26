const ConnectionManager = require('@utils/connectionManager');

module.exports = {
    async newRoomMessage(userId, data) {
        try {
            const connectionManager = new ConnectionManager();

            connectionManager.notify(userId, {
                'type': 'room:new-message',
                'message': data
            });
        } catch (error) {
            console.error(error);
        }
    },
    async purgeRoom(userId, data) {
        try {
            const connectionManager = new ConnectionManager();

            connectionManager.notify(userId, {
                'type': 'room:purge',
                'message': data
            });
        } catch (error) {
            console.error(error);
        }
    },
    async messageDeleted(userId, data) {
        try {
            const connectionManager = new ConnectionManager();

            connectionManager.notify(userId, {
                'type': 'room:message-deleted',
                'message': data
            });
        } catch (error) {
            console.error(error);
        }
    },
    async notify(userId, payload) {
        try {
            const connectionManager = new ConnectionManager();

            connectionManager.notify(userId, payload);
        } catch (error) {
            console.error(error);
        }
    }
}