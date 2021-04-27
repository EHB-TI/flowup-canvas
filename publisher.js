'use strict';

//Require libraries
require('dotenv').config();
const os = require('os');
const si = require('systeminformation');
let heartbeat = require('./script');
const amqp = require('amqplib/callback_api');

setInterval(async () => amqp.connect(process.env.AMQP_URL, (error0, connection) => {

    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        let queue = 'Usage';

        channel.assertQueue(queue, {
            durable: false
        });

        heartbeat.getUsage()
            .then((message) => {
                channel.sendToQueue(queue, Buffer.from(message));
                console.log(message);
            })
            .catch(() => console.error("An error happened with the XML. It didn't go through validation."));
    });

}), 1000);