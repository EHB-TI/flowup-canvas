class Event {

    constructor(name,description,UUID, organizerUUID){
        this.name = name;
        this.description = description;
        this.UUID = UUID;
        this.organizerUUID = organizerUUID;
    }
}

module.exports.Event = Event
