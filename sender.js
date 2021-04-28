const amqp = require('amqplib/callback_api');
require('dotenv').config()







amqp.connect('amqps://jpsjfzok:aqK80LcE0eNhVHNfH2PQMlqsj1B5pwSB@kangaroo.rmq.cloudamqp.com/jpsjfzok', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'AnasQueueForTest';
    var xml = `<?xml version="1.0" encoding="utf-8"?>

    <event>
        <header>
            <UUID>5698cd59-3acc-4f15-9ce2-83545cbfe0ba</UUID>
            <organiserUUID>333ade47-03d1-40bb-9912-9a6c86a60169</organiserUUID>
            <method>DELETE</method>
            <origin>FrontEnd</origin>
            <timestamp>2021-05-25T12:00:00+01:00</timestamp>
        </header>
        <body>
            <name>DhB Goes Tomorrowland</name>
            <startEvent>2021-05-25T12:00:00</startEvent>
            <endEvent>2021-05-27T02:00:00</endEvent>
            <description>Desiderius hogeschool Brussel gaat op uistap met alle studenten naar Tomorrowland, Poggers!</description>
            <location>Avenue Montana 34, 1180 Bruxelles</location>
        </body>
    </event>`;

  
    channel.sendToQueue(queue, Buffer.from(xml));
    console.log(" [x] Sent %s", xml);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
    }, 500);
});

