const amqp = require('amqplib');
const xml2js = require('xml2js');
const {UserHelper} = require('../Helpers/userHelper.js');
const {EventHelper} = require("../Helpers/eventHelper.js");
const {User} = require("../DTO/user.js");
const {Event} = require("../DTO/event.js");
const {EventSubscription} = require("../DTO/eventsubscription.js");
const {EventSubscribeHelper} = require("../Helpers/eventsubscribeHelper.js");
const validator = require('xsd-schema-validator');
const parser = new xml2js.Parser( /* options */ );
const builder = new xml2js.Builder();

(async function () {

    try {
        const connection = await amqp.connect(process.env.AMQP_URL);
        const channel = await connection.createChannel();
        const exchange = "direct_logs";
        const types = ["userTest", "eventTest", "eventsubscribe", "Canvas"];
        const queue = "Canvas";
        const origin = "Canvas";
        const uuid = "UUID";

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });

        await channel.assertQueue(queue, {
            durable: true
        });

        for (let type of types) {
            channel.bindQueue(queue, exchange, type);
        }

        channel.consume(queue, (msg) => {

            parser.parseStringPromise(msg.content.toString()).then(obj => {

                let type = Object.keys(obj)[0];
                let Body_info = obj[type].body;
                let UUID_info = obj[type].header;
                let method = UUID_info[0].method[0];

                // routing key to receive the xml objects from the masterUUID
                if (msg.fields.routingKey === "Canvas"){
                   if (type === "user"){
                    // xsd validation
                    validator.validateXML(msg.content.toString(), "./xsd/user.xsd", (err, result) => {
                        if (err) {
                            throw err;
                        }
                        if (result.valid) {

                            let user = new User(Body_info[0].firstname[0], Body_info[0].lastname[0], Body_info[0].email[0], UUID_info[0].sourceEntityId[0]);
                            UserHelper.handle(user, method).then(id => {
                                obj.user.header[0].origin[0] = origin;
                                obj.user.header[0].sourceEntityId[0] = id;
                                // place the xml object on the exchange with the binding uuid
                                channel.publish(exchange, uuid, Buffer.from(builder.buildObject(obj)));
                            });
                        }
                    });
                   }

                   else if (type === "event"){
                    // xsd validation
                    validator.validateXML(msg.content.toString(), "./xsd/event.xsd", (err, result) => {
                        if (err) {
                            throw err;
                        }

                        if (result.valid) {
                            console.log(UUID_info[0].sourceEntityId[0]);
                            let event = new Event(Body_info[0].name[0], Body_info[0].description[0], UUID_info[0].sourceEntityId[0], UUID_info[0].organiserSourceEntityId[0]);
                            EventHelper.handle(event, method).then(id => {
                                obj.event.header[0].origin[0] = origin;
                                obj.event.header[0].sourceEntityId[0] = id;
                                // place the xml object on the exchange with the binding uuid
                                channel.publish(exchange, uuid, Buffer.from(builder.buildObject(obj)));
                            });
                        }
                    });
                   }

                   else if (type === "eventsubscribe"){

                        // xsd validation
                        validator.validateXML(msg.content.toString(), "./xsd/eventsubscribe.xsd", (err, result) => {
                            if (err) {
                                throw err;
                            }
                        if (result.valid) {
                            let eventsubscription = new EventSubscription(Body_info[0].eventSourceEntityID[0], Body_info[0].attendeeSourceEntityID[0]);
                            EventSubscribeHelper.handle(eventsubscription, method).then(id => {
                                obj.eventsubscribe.header[0].origin[0] = origin;
                                obj.eventsubscribe.header[0].sourceEntityId[0] = id;
                                // place the xml object on the exchange with the binding uuid
                                channel.publish(exchange, uuid, Buffer.from(builder.buildObject(obj)));
                            });
                        }
                    });
                   }
                }
                 
                // check if the routing key is user
                if (msg.fields.routingKey === "userTest") {
                    
                     // xsd validation
                    validator.validateXML(msg.content.toString(), "./xsd/user.xsd", (err, result) => {
                        if (err) {
                            throw err;
                        }
                        if (result.valid) {
                            // if the xsd is valid replace the origin to canvas an place the object on the exchange with binding uuid
                            obj.user.header[0].origin[0] = origin;
                            channel.publish(exchange, uuid, Buffer.from(builder.buildObject(obj)));
                        }
                    });
        
                }

                // check if the routing key is event
                else if (msg.fields.routingKey === "eventTest") {

                    // check if the xml object that is passed is an event
                    if (type === "event"){

                        // xsd validation
                        validator.validateXML(msg.content.toString(), "./xsd/event.xsd", (err, result) => {
                            if (err) {
                                throw err;
                            }
    
                            if (result.valid) {
                                // if the xsd is valid replace the origin to canvas an place the object on the exchange with binding uuid
                                obj.event.header[0].origin[0] = origin;
                                channel.publish(exchange, uuid, Buffer.from(builder.buildObject(obj)));
                            }
                        });
                    }       

                    // check if the xml object that is passed is an eventsubscription
                    else if (type === "eventsubscribe"){

                        // xsd validation
                        validator.validateXML(msg.content.toString(), "./xsd/eventsubscribe.xsd", (err, result) => {
                            if (err) {
                                throw err;
                            }
    
                            if (result.valid) {
                                // if the xsd is valid replace the origin to canvas an place the object on the exchange with binding uuid
                                obj.event.header[0].origin[0] = origin;
                                channel.publish(exchange, uuid, Buffer.from(builder.buildObject(obj)));
                            }
                        });
                    }
                }

            }).catch(err => {
                console.log(err);
            });
            console.log(" [x] Received %s: %s", msg.fields.routingKey, msg.content.toString());
            channel.ack(msg);
        }, {
            noAck: false
        });

    } catch (err) {
        console.log(err);
    }
})();