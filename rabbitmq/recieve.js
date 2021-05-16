const amqp = require('amqplib');
const xml2js = require('xml2js');
const {UserHelper} = require('../Helpers/userHelper.js');
const {EventHelper} = require("../Helpers/eventHelper.js");
const {User} = require("../DTO/user.js");
const {Event} = require("../DTO/event.js");
const {UUIDHelper} = require("../MasterUUID/uuid_helper.js");
const {EventSubscription} = require("../DTO/eventsubscription.js");
const {EventSubscribeHelper} = require("../Helpers/eventsubscribeHelper.js");
const validator = require('xsd-schema-validator');

const parser = new xml2js.Parser( /* options */ );

(async function() {

    const source = "Canvas";
    
    try {
        const connection = await amqp.connect(process.env.AMQP_URL);
        const channel = await connection.createChannel();
        const exchange = "direct_logs";
        const types = ["user", "event" , "eventsubscribe"];
        const queue = "Canvas"

        channel.assertExchange(exchange, 'direct', {
            durable: false
          });

        await channel.assertQueue(queue, {
            durable: true
        });

        for(let type of types){
            channel.bindQueue(queue, exchange, type);
        }

        channel.consume(queue, (msg) => {

            parser.parseStringPromise(msg.content.toString()).then(result => {

                let type = Object.keys(result)[0];
                let Body_info = result[type].body;
                let UUID_info = result[type].header;

                let method = UUID_info[0].method[0];

                const uuidhelper = new UUIDHelper();

                // if type is user => process the user
                if (msg.fields.routingKey === "user"){

                    validator.validateXML(msg.content.toString(), "./xsd/user.xsd", (err, result) => {
                        if (err){
                            throw err;
                        }
                        if (result.valid){
                            let user = new User(Body_info[0].firstname[0],Body_info[0].lastname[0],Body_info[0].email[0],UUID_info[0].UUID[0]);
                            UserHelper.handle(user,method).then(id => {
                                uuidhelper.handleDb(UUID_info[0].UUID[0],source,type.charAt(0).toUpperCase() + type.slice(1),parseInt(UUID_info[0].version[0]),method,id);
                            });
                        }
                    });
                }

                // if type is user => process the event
                else if (msg.fields.routingKey === "event"){
                    
                    validator.validateXML(msg.content.toString(), "./xsd/event.xsd", (err, result) => {
                        if (err){
                            throw err;
                        }

                        if (result.valid){
                            let event = new Event(Body_info[0].name[0],Body_info[0].description[0],UUID_info[0].UUID[0]);
                            EventHelper.handle(event,method).then(id => {
                                uuidhelper.handleDb(UUID_info[0].UUID[0],source,type.charAt(0).toUpperCase() + type.slice(1),parseInt(UUID_info[0].version[0]),method,id);
                            });
                        }
                    });
                }

                // if type eventsubscribe => add user to the event
                else if (msg.fields.routingKey === "eventsubscribe"){

                    validator.validateXML(msg.content.toString(), "./xsd/eventsubscribe.xsd", (err,result) => {
                        if (err){
                            throw err;
                        }
                        if (result.valid){
                            let eventsubscription = new EventSubscription(Body_info[0].eventUUID[0],Body_info[0].attendeeUUID[0]); 
                            EventSubscribeHelper.handle(eventsubscription,method).then(id => {
                                uuidhelper.handleDb(UUID_info[0].UUID[0],source,type.charAt(0).toUpperCase() + type.slice(1),parseInt(UUID_info[0].version[0]),method,id);
                            }); 
                        }
                    });    
                }

            }).catch(err => {
                console.log(err);
            });
            console.log(" [x] Received %s: %s",msg.fields.routingKey, msg.content.toString());
            channel.ack(msg);
        }, {
            noAck: false
        });

    } catch (err) {
        console.log(err);
    }
})();
