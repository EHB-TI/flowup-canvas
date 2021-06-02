const {axios,querystring}= require("./axios_config.js");

const calendar_events_endpoint = "/calendar_events";

const get_course_endpoint = `/accounts/1/courses/sis_course_id:${process.env.SIS_EVENTCOURSE_ID}`;

async function getIDOfEventsCourse(){
  
    let response = await axios.get(get_course_endpoint);

    return response.data.id;

}


module.exports.create_calendar_event = async(event) => {

    try {
        let calendar_event = await giveCalendarObject(event);
        let response = await axios.post(calendar_events_endpoint, querystring.stringify({...calendar_event}));

        if (response.status === 200 || response.status === 201){

           return response.data.id;
        }
    }
    catch(err){
        return err.response.status;
    }
}


module.exports.update_calendar_event = async(event,calendar_id) => {

    try {

         let calendar_event = await giveCalendarObject(event);
         let response = await axios.put(`calender_events_endpoint/${calendar_id}`, querystring.stringify({...calendar_event}));
         return response.data.id;
    }
    catch(err){
        err.response.status;
    }
}

module.exports.delete_calendar_event = async(calendar_id) => {

    try {
     let response = await axios.delete(`calender_events_endpoint/${calendar_id}`);
     return response.status;
    }
    catch(err){
        return err.response.status;
    }
}

async function giveCalendarObject(event){

    let course_id = await getIDOfEventsCourse();

    //////////////// Transforming data en sending it back to the create and update calendar methods ////////////////

    // start + whitespace = 6 characters
    let start = event.description[1].slice(6);

    // end + whitespace = 4 characters
    let end = event.description[2].slice(4);

    // fill in our calendar object
    let calendar_event =  {
        "calendar_event[context_code]": `course_${course_id}`,
        "calendar_event[title]" : event.name,
        "calendar_event[start_at]": start,
        "calendar_event[end_at]": end
    }

    return calendar_event;
}