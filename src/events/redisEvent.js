const notifyUserController = require('@controllers/subscriber/notifyUserController');
const roomService = require('@services/roomService');

module.exports = (message) => {
    try {
        const { type, userId, data } = JSON.parse(message)

        console.log(`Event received of type ${type} for user ${userId}`)
        console.log(data);

        roomService.notify(userId, {
            'type': type,
            'data': data
        });
    } catch (error) {
        console.error(error);
    }
}