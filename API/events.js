const {axios,querystring}= require("./axios_config.js");
const {add_user_to_event} = require("../API/eventsubscribe.js");

const get_group_endpoint = "/groups/sis_group_id:";

const get_group_categories_endpoint = "/group_categories";

const get_groups_endpoint = "/groups";

const get_eventcourse_endpoint = `/courses/sis_course_id:${process.env.SIS_EVENTCOURSE_ID}`;

module.exports.createEvent = async (event) => {

  let groupCategorieID;

  const data = {
    "name": event.name,
    "description": event.description,
    "sis_group_id": event.UUID
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

     // add the organizer to the event 
     await add_user_to_event(event.UUID, event.organizerUUID);
     return response.data.id;
  }
  catch(error){
    throw error;
  }
}

module.exports.updateEvent = async (event) => {
  
  // data for updating the event
  const data = {
      "name": event.name,
      "description": event.description,
  };

  try {
    // update the event
    let response = await axios.put(`${get_group_endpoint}${event.UUID}`, querystring.stringify({...data}));

    // in case the organizer has unsubscribed or there is a different organizer => add user to event (this will do nothing if the user is already added)
    await add_user_to_event(event.UUID, event.organizerUUID);
    return response.data.id;
  }

  catch(error){
    throw error;
  }
}

module.exports.deleteEvent = async (event) => {

  try {
    await axios.delete(`${get_group_endpoint}${event.UUID}`);
  }

  catch(error){
    throw error;
  }
}