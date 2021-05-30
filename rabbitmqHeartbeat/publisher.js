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

        // let queue = 'heartbeat';
        let binding = 'heartbeat';

        //Send the heartbeat to the exchange, which will be redirected to the heartbeat queue. 
        let exchange = 'direct_logs'; 

        setInterval(() => {

            channel.assertExchange(exchange, 'direct', {
                durable: false
              });

            heartbeat.getUsage()
                .then((message) => {

                    channel.publish(exchange, binding, Buffer.from(message));
                })
                .catch((message) => {

                    channel.publish(exchange, binding, Buffer.from(message));
                    console.error("An error happened with the XML. It didn't go through validation.")
                });
        }, 1000);
    
        //This code will send the heartbeat directly to the queue. 
        // setInterval(() => {
        //     heartbeat.getUsage()
        //         .then((message) => {
        //             channel.sendToQueue(queue, Buffer.from(message));
        //             console.log(message);
        //         })
        //         .catch((message) => {

        //             channel.sendToQueue(queue, Buffer.from(message));
        //             console.log(message);

        //             console.error("An error happened with the XML. It didn't go through validation.");
        //         });
        // }, 1000);

    });
}))();