const amqp = require('amqplib');
const validator = require('xsd-schema-validator');

const queue = "Canvas";

require('dotenv').config();

let msg = `<?xml version="1.0" encoding="utf-8"?>
            <user>
                <header>
                       <UUID>333ade47-03d1-40bb-9912-9a6c86a60169</UUID>
                       <method>CREATE</method>
                       <origin>AD</origin>
                       <timeStamp>2021-05-25T12:00:00</timeStamp>
                </header>
                <body>
                     <firstname>Tibo</firstname>
                     <lastname>De Munck</lastname>
                     <email>tibo.de.munck@student.ehb.be</email>
                     <birthday>1998-06-03</birthday>
                     <role>student</role>
                     <study>Dig-X</study>
                </body>
            </user>`;

(async function() {

    try {
        const connection = await amqp.connect(process.env.AMQP_URL);
        const channel = await connection.createChannel();
        channel.assertQueue(queue, {
            durable : false
        })
        
        validator.validateXML(msg, './xsd/user.xsd', (err, result) => {

            if (result.valid){
                channel.sendToQueue(queue, Buffer.from(msg));
            }

            else {
                console.log(err);
            }
        });
         
        setTimeout(function () {
            connection.close();
            process.exit(0)
        }, 500);

    } 
    catch (err) {
        console.log(err);
    }
})();

