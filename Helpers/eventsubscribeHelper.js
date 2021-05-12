const {remove_user_from_event,add_user_to_event} = require("../API/eventsubscribe.js");

class EventSubscribeHelper {

    static handle(eventsubscription,method){
 
        if (method === "UNSUBSCRIBE"){
            remove_user_from_event(eventsubscription.event_uuid,eventsubscription.user_uuid);

        }

        else if (method === "SUBSCRIBE"){
            add_user_to_event(eventsubscription.event_uuid,eventsubscription.user_uuid);
        }

    }

}

module.exports.EventSubscribeHelper = EventSubscribeHelper;