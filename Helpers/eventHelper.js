const {createEvent, updateEvent, deleteEvent} = require("../API/events.js");

class EventHelper {

    constructor(){
    }
    
    static handle(event,method){

        if (method === "CREATE"){
            return createEvent(event); 
        }

        else if (method === "UPDATE"){
            return updateEvent(event);
        }

        else if (method === "DELETE") {
            return deleteEvent(event);
        }
    }
}

module.exports.EventHelper = EventHelper;