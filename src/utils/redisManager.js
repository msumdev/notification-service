const redis = require('redis');
const redisEvent = require('@events/redisEvent');

module.exports = class RedisManager {
    constructor(options = {}) {
        this.client = redis.createClient({
            url: `redis://@${options.host}:${options.port}/${options.db}`
        });
        this.publisher = redis.createClient({
            url: `redis://@${options.host}:${options.port}/${options.db}`
        });
        this.subscriber = redis.createClient({
            url: `redis://@${options.host}:${options.port}/${options.db}`
        });

        this.serverId = process.env.SERVER_ID || options.serverId;
        
        this._registerEventHandlers();

        this.connections = [];
    }

    async _registerEventHandlers() {
        this.client.on('connect', async() => {
            this.deleteAllKeysForServerId();
        });

        this.publisher.on('error', (err) => {
            console.error('Redis connection error:', err);
        });

        this.publisher.on('connect', async () => {
            try {
                console.log('Publisher connected');
            } catch (error) {
                console.error('Error setting redis connected:', error);
            }
        });

        this.subscriber.on('error', (err) => {
            console.error('Redis connection error:', err);
        });

        this.subscriber.on('connect', async () => {
            try {
                console.log('Subscriber connected');
            } catch (error) {
                console.error('Error setting redis connected:', error);
            }
        });

        this.subscriber.on('message', (channel, message) => {
            console.log(`Received message from channel '${channel}': ${message}`);
        });

        await this.subscriber.subscribe(process.env.MAIN_SUBSCRIBER_CHANNEL, (message) => {
            redisEvent(message);
        });
    }
    
    async init() {
        try {
            await this.tryConnect();
        } catch (error) {
            console.error('Error initializing redis:', error);
        }
    }

    async tryConnect() {
        if (!this.client.isOpen) {
            this.client = await this.client.connect();

            this.deleteAllKeysForServerId();
        }

        if (!this.publisher.isOpen) {
            await this.publisher.connect();
        }

        if (!this.subscriber.isOpen) {
            await this.subscriber.connect();
        }
    }

    async close() {
        try {
            await this.publisher.quit();
            await this.subscriber.quit();
        } catch (error) {
            console.error('Error closing redis connection:', error);
        }
    }

    async deleteAllKeysForServerId() {
        const keys = await this.client.keys(`user-count:*`);

        for (const key of keys) {
            await this.client.del(key);
        }
    }
};