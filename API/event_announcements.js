const {axios,querystring}= require("./axios_config.js");

const groups_endpoint = "/groups/";

const topics_endpoint = "/discussion_topics";

// create an announcement every time an event is updated or created
module.exports.create_event_announcement = async(event) => {
   
    const params = {
        "title": event.name,
        "message": event.description,
        "is_announcement": true
    }

    let res_announcement = await axios.post(`${groups_endpoint}${event.id}${topics_endpoint}`, querystring.stringify({...params}));

    // 200 = ok 400-500 = ERROR
    return res_announcement.status;
}