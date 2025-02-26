const RedisManager = require('@utils/redisManager');

module.exports = {
    async setup(id) {
        this.redisInstance = new RedisManager({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            db: process.env.REDIS_DB,
            serverId: id
        });

        await this.redisInstance.init();
    },
    async put(key, value) {
        await this.redisInstance.publisher.set(key, value);
    },
    async get(id, key) {
        return await this.redisInstance.client.get(key);
    },
    async incrementConnectionCountForUser(userId) {
        const key = `user-count:${userId}`;
        const existingCount = await this.redisInstance.client.get(key);

        if (existingCount) {
            await this.redisInstance.client.set(key, parseInt(existingCount, 10) + 1);
        } else {
            await this.redisInstance.client.set(key, 1);
        }
    },
    async decrementConnectionCountForUser(userId) {
        const key = `user-count:${userId}`;
        const existingCount = await this.redisInstance.client.get(key);

        if (existingCount > 1) {
            await this.redisInstance.client.set(key, parseInt(existingCount, 10) - 1);
        } else {
            await this.redisInstance.client.del(key);
        }
    },
    async publish(payload) {
        const json = JSON.stringify(payload);

        try {
            await this.redisInstance.publisher.publish(process.env.MAIN_SUBSCRIBER_CHANNEL, json);
        } catch (error) {
            console.error('Error publishing message:', error);
        }
    }
};
  