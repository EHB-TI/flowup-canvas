'use strict';

//Require libraries
require('dotenv').config();
let heartbeat = require('./script');
const amqp = require('amqplib/callback_api');

(() => amqp.connect(process.env.RABBITMQ_SERVER, (error0, connection) => {

    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        let queue = 'hello';

        setInterval(() => {
            heartbeat.getUsage()
                .then((message) => {
                    channel.sendToQueue(queue, Buffer.from(message));
                    console.log(message);
                })
                .catch(() => console.error("An error happened with the XML. It didn't go through validation."));
        }, 1000);
    });
}))();