const {axios,querystring}= require("./axios_config.js");
const {add_user_to_event} = require("../API/eventsubscribe.js");
const {create_event_announcement } = require("../API/event_announcements.js"); 
const {create_calendar_event, update_calendar_event, delete_calendar_event } = require("../API/event_calendar.js"); 
const get_group_endpoint= "/groups/";

const get_group_categories_endpoint = "/group_categories";

const get_groups_endpoint = "/groups";

const get_eventcourse_endpoint = `/courses/sis_course_id:${process.env.SIS_EVENTCOURSE_ID}`;

const {insert_into_localdb, get_calendar_id, delete_calendar, calendar_id_in_localdb }= require("../DB/calendars.js");

module.exports.createEvent = async (event) => {

  let groupCategorieID;

  const data = {
    "name": event.name,
    "description": event.description,
  };

  try {
    // fetch the group categories of the course Events
    const groupCategories = await axios.get(`${get_eventcourse_endpoint}${get_group_categories_endpoint}`);

    // find the groupcategory "Events"
    for (let groupCategorie of groupCategories.data) {
        if (groupCategorie.name == "Events") {
           groupCategorieID = groupCategorie.id;
           // go out of the loop if the id is found
           break;
          }
        }
    
    // add the event to the groupcategory "Events"
     let response = await axios.post(`${get_group_categories_endpoint}/${groupCategorieID}${get_groups_endpoint}`, querystring.stringify({...data}));

     // check if the event is properly added
     if (response.status === 200){
 
      // create a new announcement with the event data
      event.id = response.data.id;
      await create_event_announcement(event);

      // add the event to the canvas calendar
      let calendar_id = await create_calendar_event(event);

      // store the calendar id in a local db
      await insert_into_localdb(event.id, calendar_id);

      // add the organiser to the event
      await add_user_to_event(response.data.id, event.organiser_id);
      
      return response.data.id;

     }

  }
  catch(error){
    
    console.log(error);
    
  }
}

module.exports.updateEvent = async (event) => {
  
  // data for updating the event
  const data = {
      "name": event.name,
      "description": event.description.join("\n"),
  };

  try {

    // update the event
    let response = await axios.put(`${get_group_endpoint}${event.id}`, querystring.stringify({...data}));
    
    if (response.status === 200){

      let has_calendar_id = await calendar_id_in_localdb(event.id);

      if (has_calendar_id){
        let calendar_id = await get_calendar_id(event.id);
        // update the event in the canvas calendar
        await update_calendar_event(event,calendar_id);

      }
      // create a new announcement with the updated event data
      await create_event_announcement(event);

       return event.id;
     } 
    
    
  }

  catch(error){
    
    return error.response.status;
   
  }
}

module.exports.deleteEvent = async (event) => {

  try {

    // check if event has calendar_id
    let has_calendar_id = await calendar_id_in_localdb(event.id);

    if (has_calendar_id){
      // get the calendar_id
      let calendar_id = await get_calendar_id(event.id);
        // delete the event in the canvas calendar
        await delete_calendar_event(calendar_id);

        // remove row from localdb
        await delete_calendar(event.id,calendar_id);
    }

    // then delete the event
    let response = await axios.delete(`${get_group_endpoint}${event.id}`);
    return response.status;
  }

  catch(error){
    
    return error.response.status;
    
  }
}