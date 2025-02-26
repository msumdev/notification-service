# A Node JS websocket server

A working example of a websocket server designed to act as a notification service for messages generated my Laravel application. Redis is used to distribute messages to all websocket instances. This is for scalability. Messages are pushed to a redis queue, picked up and processed if the client is on that specific websocket instance.

At the moment this is designed to work with multiple docker websocket instances. However in production, this will be in a kubernetes environment with its own redis server.
