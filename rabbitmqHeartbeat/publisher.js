'use strict';

//Require libraries
let heartbeat = require('../Helpers/script.js');
const amqp = require('amqplib/callback_api');

(() => amqp.connect('amqp://10.3.56.6', (error0, connection) => {

    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        let queue = 'heartbeat';


        setInterval(() => {
            heartbeat.getUsage()
                .then((message) => {
                    channel.sendToQueue(queue, Buffer.from(message));
                    console.log(message);
                })
                .catch((message) => {

                    channel.sendToQueue(queue, Buffer.from(message));
                    console.log(message);

                    console.error("An error happened with the XML. It didn't go through validation.");
                });
        }, 1000);
    });
}))();