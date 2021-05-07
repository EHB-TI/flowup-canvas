const amqp = require('amqplib/callback_api');
const parser = require('xml2json');
const validator = require('xsd-schema-validator');
const fetch = require("node-fetch");
const { createEvent,updateEvent,deleteEvent } =  require("../API/events.js");



amqp.connect('amqps://jpsjfzok:aqK80LcE0eNhVHNfH2PQMlqsj1B5pwSB@kangaroo.rmq.cloudamqp.com/jpsjfzok', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    let queue = 'AnasQueueForTest';

    channel.assertQueue(queue, {
      durable: false
    });

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);



    channel.consume(queue,async function (msg) {

      let xml = msg.content.toString();

      validator.validateXML(xml, './xsd/schemaValidator.xsd', function (err, result) {
        if (err) {
          throw err;
        }

        
      });

      let jsonObject = JSON.parse(parser.toJson(xml));
      let method = jsonObject.event.header.method;
     

     

      

      


     switch (method) {
       case "CREATE":

         console.log(await createEvent(jsonObject));
         
         break;

      case "UPDATE":
        console.log(await updateEvent(jsonObject));
         
         break;

      case "DELETE":
        console.log(await deleteEvent(jsonObject));
         
         break;
     
       default:
         break;
     }

      


      /*
      async function deleteEvent() {
        let eventExists = false;
        let courseID;
        let groupID;
        let event;

       
        

        let courses = await getCourses();
        for (let course of courses) {
          if (course.name == "Events") {
            courseID = course.id;
          }
        }

        

        let groups = await getGroups(courseID);
        for (let group of groups) {
          if (group.name == json.event.body.name) {
            eventExists = true;
            groupID = group.id;
          }
        }

        if(eventExists == true)
        {
            otherRequestsOptions.method = "DELETE";
            event = deleteGroup(groupID);
        }

        console.log(event);
        

        return event;

        
      }
      */

      

    }, {
      noAck: true
    });
  });
});