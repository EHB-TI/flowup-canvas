const amqp = require('amqplib/callback_api');
const parser = require('xml2json');
const validator = require('xsd-schema-validator');
require('dotenv').config()
const fetch = require("node-fetch");
const api = process.env.API_Token;


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



    channel.consume(queue, function (msg) {

      let xml = msg.content.toString();

      validator.validateXML(xml, 'schemaValidator.xsd', function (err, result) {
        if (err) {
          throw err;
        }

        console.log(result.valid); // true
      });

      let json = JSON.parse(parser.toJson(xml));
      let method = json.event.header.method;
      method = JSON.stringify(method);

      let data = ``;

      let otherRequestsOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api}`
        },
        mode: 'cors',
        cache: 'default',
        body: data
      };




      const getRequestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${api}`
        },
        mode: 'cors',
        cache: 'default',
      };

      method = JSON.stringify(method);


      let objectt = {
        "CREATE": createEvent(),
        "UPDATE": updateEvent(),
        "DELETE": deleteEvent()
      }

      objectt.method;



      async function createEvent() {

        let eventExists = false;
        let courseID;
        let groupCategorieID;

        let courses = await getCourses();
        for (let course of courses) {
          if (course.name == "Events") {
            courseID = course.id;
          }
        }

        let groupCategories = await getGroupCategorys(courseID);
        for (let groupCategorie of groupCategories) {
          if (groupCategorie.name == "Events") {
            groupCategorieID = groupCategorie.id;
            
          }

        }

        let groups = await getGroups(courseID);

        
        
        for(let group of groups) {
          console.log(group);
          
          if (group.name == json.event.body.name) {
            eventExists = true;
          }
        }
        
        
        if (eventExists == false) {
          
          data = `{
            "name": "${json.event.body.name}",
            "description": "${json.event.body.description}"
          }`;

          otherRequestsOptions.body = data;
          otherRequestsOptions.method = "POST";

          let event = await createGroup(groupCategorieID);

          


        }
        
        return eventExists;
      }

      function updateEvent() {

      }

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

      async function getGroupCategorys(id) {
        let data = await fetch(`http://10.3.56.4/api/v1/courses/${id}/group_categories`, getRequestOptions);
        let results = await data.json();
        return results;

      }

      async function getGroups(id) {
        let data = await fetch(`http://10.3.56.4/api/v1/courses/${id}/groups`, getRequestOptions);
        let results = await data.json();
        return results;
      }

      async function createGroup(id) {
        let data = await fetch(`http://10.3.56.4/api/v1/group_categories/${id}/groups`, otherRequestsOptions);
        let results = await data.json();
        return results;
      }

      async function deleteGroup(id) {
        let data = await fetch(`http://10.3.56.4/api/v1/groups/${id}`, otherRequestsOptions);
        let results = await data.json();
        return results;
      }


      async function getCourses() {
        let data = await fetch('http://10.3.56.4/api/v1/courses', getRequestOptions);
        let results = await data.json();
        return results;
      }






    }, {
      noAck: true
    });
  });
});