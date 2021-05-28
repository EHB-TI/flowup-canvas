const {axios,querystring}= require("./axios_config.js");
const {add_user_to_event} = require("../API/eventsubscribe.js");

const get_group_endpoint= "/groups/";

const get_group_categories_endpoint = "/group_categories";

const get_groups_endpoint = "/groups";

const get_eventcourse_endpoint = `/courses/sis_course_id:${process.env.SIS_EVENTCOURSE_ID}`;

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
        await add_user_to_event(response.data.id, event.organiser_id);
        return response.data.id;
     }

     return undefined;
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
    await axios.put(`${get_group_endpoint}${event.id}`, querystring.stringify({...data}));

    // in case the organizer has unsubscribed or there is a different organiser => add user to event (this will do nothing if the user is already added)
    await add_user_to_event(event.id, event.organiser_id);
    return event.id;
  }

  catch(error){
    throw error;
  }
}

module.exports.deleteEvent = async (event) => {

  try {
   let response =  await axios.delete(`${get_group_endpoint}${event.id}`);
   
   

   
    // check if the event is properly deleted
    if (response.status === 200){
      return response.data.id;
   }

  }

  catch(error){
    throw error;
  }
}