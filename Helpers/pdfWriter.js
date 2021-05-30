const PDFDocument = require('pdfkit');
const fs = require('fs');



module.exports.createEventPDF = async (name,description,startEvent,endEvent,location) =>
{

    console.log(name);
    console.log(description);
    console.log(startEvent);
    console.log(endEvent);
    console.log(location);

let trimName = name.replace(" ","");
console.log(trimName);

// Create a document
const doc = new PDFDocument();

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
doc.pipe(fs.createWriteStream(`./PDF/${trimName}.pdf`));

doc
.fontSize(20)
.text(`Event : ${name}`,{ width: 150});

doc.moveDown();

doc
.fontSize(15)
.text(`Description : ${description}`,{ width: 150});


doc.moveDown();

doc
.fontSize(15)
.text(`Start Event : ${startEvent}`,{ width: 150});

doc.moveDown();

doc
.fontSize(15)
.text(`End Event : ${endEvent}`,{ width: 150});

doc.moveDown();

doc.fontSize(15)
.text(`Location : ${location}`,{ width: 150});


doc.end();

}

