class EventSubscription {

    constructor(event_uuid,user_uuid){
        this.event_uuid = event_uuid;
        this.user_uuid = user_uuid;
    }

}

module.exports.EventSubscription = EventSubscription;