const amqp = require('amqplib');
const xml2js = require('xml2js');
const {create_user , update_user, delete_user} = require('../API/users.js')


require('dotenv').config();


const parser = new xml2js.Parser( /* options */ );

const queue = "Canvas";

(async function() {
    
    try {
        const connection = await amqp.connect(process.env.AMQP_URL);
        const channel = await connection.createChannel();

        channel.assertQueue(queue, {
            durable: false
        });

        channel.consume(queue, (msg) => {

            parser.parseStringPromise(msg.content.toString()).then(result => {

                let Body_info = result.user.body;
                let UUID_info = result.user.header;

                let method = UUID_info[0].method[0];

                if (method === "CREATE"){
                    create_user(Body_info[0].firstname[0],Body_info[0].lastname[0],Body_info[0].email[0]);
                }
        
                else if (method === "UPDATE"){
                    update_user(Body_info[0].firstname[0],Body_info[0].lastname[0],Body_info[0].email[0]);
                }
        
                else {
                    delete_user(Body_info[0].email[0]);
                }
                
            }).catch(err => {
                console.log(err);
            });

            //console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });

    } catch (err) {
        console.log(err);
    }
})();
