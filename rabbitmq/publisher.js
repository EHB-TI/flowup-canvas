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

        //When the exchange will be setup, this code can be used instead of a direct connection with the queue.
        //let exchange = 'logs'; 
        // setInterval(() => {
        //     heartbeat.getUsage()
        //         .then((message) => {
        //             channel.assertExchange(exchange, 'direct', {
        //                 durable: false
        //               });
        //             channel.publish(exchange, '', Buffer.from(msg));
        //             console.log(message);
        //         })
        //         .catch(() => console.error("An error happened with the XML. It didn't go through validation."));
        // }, 1000);
    
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