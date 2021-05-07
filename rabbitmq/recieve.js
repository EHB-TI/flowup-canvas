const amqp = require('amqplib');
const xml2js = require('xml2js');
const {create_user , update_user, delete_user} = require('../API/users.js');
const { uuid_exists, update } = require('../MasterUUID/uuid_interact.js');


require('dotenv').config();


const parser = new xml2js.Parser( /* options */ );

(async function() {
    
    try {
        const connection = await amqp.connect(process.env.AMQP_URL);
        const channel = await connection.createChannel();
        const exchange = "direct_logs";
        const types = ["user, events"];

        channel.assertExchange(exchange, 'direct', {
            durable: false
          });

        const q = await channel.assertQueue('', {
            exclusive: true
        });


        for(let type of types){
            channel.bindQueue(q.queue, exchange, type);
        }
        
        channel.prefetch(1);
        channel.consume(q.queue, (msg) => {

            parser.parseStringPromise(msg.content.toString()).then(result => {

                let type = Object.keys(result)[0];
                let Body_info = result[type].body;
                let UUID_info = result[type].header;

                let method = UUID_info[0].method[0];
 
                if (method === "CREATE"){
                    let status = create_user(Body_info[0].firstname[0],Body_info[0].lastname[0],Body_info[0].email[0],UUID_info[0].UUID[0]);
                    if (status === 200){
                        channel.ack(msg);
                    }  
                }

                else if (method === "UPDATE"){
                    let status = update_user(Body_info[0].firstname[0],Body_info[0].lastname[0],Body_info[0].email[0],UUID_info[0].UUID[0]);
                    if (status === 200){
                        channel.ack(msg);
                    }
                }

                else {
                    let status = delete_user(UUID_info[0].UUID[0]);
                    if (status === 200){
                        channel.ack(msg);
                    }
                }
                
            }).catch(err => {
                console.log(err);
            });
            console.log(" [x] Received %s: %s",msg.fields.routingKey, msg.content.toString());
        }, {
            noAck: false
        });

    } catch (err) {
        console.log(err);
    }
})();
