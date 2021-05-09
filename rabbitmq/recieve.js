const amqp = require('amqplib');
const xml2js = require('xml2js');
const {UserHelper} = require('../Helpers/userHelper.js');
const {EventHelper} = require("../Helpers/eventHelper.js");
const {User} = require("../DTO/user.js");
const {Event} = require("../DTO/event.js");
const {UUIDHelper} = require("../MasterUUID/uuid_helper.js");


require('dotenv').config();


const parser = new xml2js.Parser( /* options */ );

(async function() {

    const source = "Canvas";
    
    try {
        const connection = await amqp.connect(process.env.AMQP_URL);
        const channel = await connection.createChannel();
        const exchange = "direct_logs";
        const types = ["user", "events"];

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

                const uuidhelper = new UUIDHelper();

                // first talk to the DB , this is the same regardless of which type (user or event)
                uuidhelper.handleDb(UUID_info[0].UUID[0],source,type.charAt(0).toUpperCase() + type.slice(1),parseInt(UUID_info[0].version[0]),method);
 
                if (msg.fields.routingKey === "user"){
                    let user = new User(Body_info[0].firstname[0],Body_info[0].lastname[0],Body_info[0].email[0],UUID_info[0].UUID[0]);
                    let status = UserHelper.handle(user,method);
                    if (status === 200){
                        channel.ack(msg);
                    }
                }

                else if (msg.fields.routingKey === "events"){
                    console.log(Body_info[0].name[0]);
                    console.log(Body_info[0].description[0]);
                    let event = new Event(Body_info[0].name[0],Body_info[0].description[0],UUID_info[0].UUID[0]);
                    let status = EventHelper.handle(event,method);
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
