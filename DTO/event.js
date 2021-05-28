class Event {

    constructor(name,description,id,organiser_id){
        this.name = name;
        this.description = description;
        this.id = id;
        this.organiser_id = organiser_id;
    }
}

module.exports.Event = Event
