const axios = require('axios');
require('dotenv').config();
const api = process.env.API_Token;
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${api}`
};


 async function getGroupCategorys (id){
    
    try {
      let response = await axios.get(`http://10.3.56.4/api/v1/courses/${id}/group_categories`,{headers});
      return response.data;
    } catch (error) {
      console.error(error);
    }

  }

  async function getGroups (id) {
    try {
      let response = await axios.get(`http://10.3.56.4/api/v1/courses/${id}/groups`,{headers});
      return response.data;
    } catch (error) {
      console.error(error);
    }

  }

 async function createGroup (id,body) {

    

    const config = {

      params: body,
      headers: headers
  }


    try {
      let response = await axios.post(`http://10.3.56.4/api/v1/group_categories/${id}/groups`, null, config);
      return response.data;
    } catch (error) {
      console.error(error);
    }

  }

  async function updateGroup (id,body) {

    

    const config = {

      params: body,
      headers: headers
  }


    try {
      let response = await axios.put(`http://10.3.56.4/api/v1/groups/${id}`, null, config);
      return response.data;
    } catch (error) {
      console.error(error);
    }

  }


  async function deleteGroup (id) {

    try {
      let response = await axios.delete(`http://10.3.56.4/api/v1/groups/${id}`,{headers});
      return response.data;
    } catch (error) {
      console.error(error);
    }

  }

 
  async function getCourses () {
    

    try {
      let response = await axios.get('http://10.3.56.4/api/v1/courses',{headers});
      return response.data;
    } catch (error) {
      console.error(error);
    }
    

  }

  module.exports.createEvent =  async (jsonObject) => {

    let eventExists = false;
    let event;
    let courseID;
    let groupCategorieID;

    let courses = await getCourses();

    console.log(courses);
    for (let course of courses) {
      if (course.name == "Events") {
        courseID = course.id;
      }
    }

    let groupCategories = await getGroupCategorys(courseID);
    for (let groupCategorie of groupCategories) {
      if (groupCategorie.name == "Events") {
        groupCategorieID = groupCategorie.id;
        
      }

    }

    let groups = await getGroups(courseID);

    
    
    for(let group of groups) {
      console.log(group);
      
      if (group.name == jsonObject.event.body.name) {
        eventExists = true;
      }
    }
    
    
    if (eventExists == false) {
      
      let data = {
        "name": `${jsonObject.event.body.name}`,
        "description": `${jsonObject.event.body.description}`
      };


      event = await createGroup(groupCategorieID,data);
    }

    else{
      event = "Event with this name already exist";
    }
    
    return event;
  }

  module.exports.updateEvent =  async (jsonObject) =>{

    

  }

  module.exports.deleteEvent =  async (jsonObject) =>{

    let eventExists = false;
        let courseID;
        let groupID;
        let event;

       
        

        let courses = await getCourses();
        for (let course of courses) {
          if (course.name == "Events") {
            courseID = course.id;
          }
        }

        

        let groups = await getGroups(courseID);
        for (let group of groups) {
          if (group.name == jsonObject.event.body.name) {
            eventExists = true;
            groupID = group.id;
          }
        }

        if(eventExists == true)
        {
            
            event = deleteGroup(groupID);
        }

        else{
          event = "Event with this name don't exist";
        }
        

        return event;


  }