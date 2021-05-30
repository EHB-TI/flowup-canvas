'use strict';

//Require libraries
const si = require('systeminformation');
const validator = require('xsd-schema-validator');

//Global variables
let cpuUsage = '';
const errorCode = 2200;
let memUsage = '';
let newXml = '';
const successCode = 2000;
let xml = '';


//1. Get CPU -and RAM usage
let getUsage = () => {

    return new Promise(async (resolve, reject) => {

        await Promise.all([si.currentLoad(), si.mem()]).then(data => {

            cpuUsage = data[0].currentLoad.toFixed(2);

            let memoryUsage = data[1].total - (data[1].free + data[1].buffcache);
            memUsage = ((memoryUsage / data[1].total) * 100).toFixed(2);


        }).catch(error => console.error(error));


        //  2. Format date to xs:datetime and create the XML
        let date = new Date();
        date.setHours(date.getHours() + 2);
        let formatted = date.toISOString();

        let heartbeatXml =
            `<heartbeat>
    <header>    
        <code>${successCode}</code>    
        <origin>Canvas</origin>    
        <timestamp>${formatted}</timestamp>  
    </header>  
    <body>    
        <nameService>LMS</nameService>
        <CPUload>${cpuUsage}</CPUload>
        <RAMload>${memUsage}</RAMload>
    </body>
</heartbeat>`

        //  3. Validate previously created XML, change code attribute value if error
        validator.validateXML(heartbeatXml, '../xsd/heartbeat.xsd', (err, result) => {
            
            if (err) {

                newXml = heartbeatXml.replace(`<code>${successCode}</code>`, `<code>${errorCode}</code>`);
                reject(newXml);
            } 
            else {

                result.valid; // true
                resolve(heartbeatXml);
            }
        });
    })
}

//Export the XML, containing CPU and RAM load, to the publisher. 
exports.getUsage = getUsage;