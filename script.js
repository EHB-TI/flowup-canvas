'use strict';

//Require libraries
const si = require('systeminformation');
const validator = require('xsd-schema-validator');
const xml2js = require('xml2js');

//Global variables
let cpuUsage = '';
let datum = new Date();
const errorCode = 2200;
let format = '';
let memUsage = '';
let newXml = '';
const successCode = 2000;
let xml = '';


// console.log(`2021-05-25T12:00:00+01:00`)
// console.log(format);

//1. Get CPU -and RAM usage
let getUsage = () => {

    return new Promise(async (resolve, reject) => {

        await Promise.all([si.currentLoad(), si.mem()]).then(data => {


            cpuUsage = data[0].currentLoad.toFixed(2);

            let memoryUsage = data[1].total - (data[1].free + data[1].buffcache);
            memUsage = ((memoryUsage / data[1].total) * 100).toFixed(2);


        }).catch(error => console.error(error));

        
        //  2. Format object to XML
        let heartbeatObject = {
            heartbeat: {
                header: {
                    code: successCode, //TODO: Get correct code (success or error) 
                    origin: 'Canvas',
                    timestamp: `2021-05-25T12:00:00+01:00` //TODO: Format JS date to xs:DateTime
                },
                body: {
                    nameService: "LMS",
                    CPUload: cpuUsage,
                    RAMload: memUsage
                }
            }
        }

        const builder = new xml2js.Builder();
        xml = builder.buildObject(heartbeatObject);

        
        //  3. Validate previously created XML, change code attribute value if error
        validator.validateXML(xml, './heartbeatValidator.xsd', (err, result) => {

            if (err) {

                newXml = xml.replace(`<code>${successCode}</code>`, `<code>${errorCode}</code>`);
                reject(newXml);

            } else {

                result.valid; // true
                resolve(xml);
            }
        });
    })
}

//Export the XML, containing CPU and RAM load, to the publisher. 
exports.getUsage = getUsage;