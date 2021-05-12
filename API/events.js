const axios = require('axios');
require('dotenv').config();

const headers = {
  "Content-type": "application/json",
  "Authorization": `Bearer ${process.env.API_token}`
}

const get_group = "http://10.3.56.4/api/v1/groups/sis_group_id:";

const get_user_url = "http://10.3.56.4/api/v1/users/sis_user_id:";

async function getGroupCategorys(id) {

  try {
    let response = await axios.get(`http://10.3.56.4/api/v1/courses/${id}/group_categories`, {
      headers
    });
    return response;
  } catch (error) {
    console.error(error);
  }

}

async function createGroup(id, body) {

  const config = {

    params: body,
    headers: headers
  }

  try {
    let response = await axios.post(`http://10.3.56.4/api/v1/group_categories/${id}/groups`, null, config);

    return response;
  } catch (error) {

    throw error;
  }

}

async function updateGroup(id, body) {

  const config = {

    params: body,
    headers: headers
  }

  try {
    let response = await axios.put(`${get_group}${id}`, null, config);
    return response;
  } 
  catch (error) {
    throw error;
  }
}


async function deleteGroup(id) {

  try {
    let response = await axios.delete(`${get_group}${id}`, {
      headers
    });
    return response;
  } 
  catch (error) {
    throw error;
  }

}

async function getCourses() {

  try {
    let response = await axios.get('http://10.3.56.4/api/v1/courses', {
      headers
    });
    return response;
  } 
  catch (error) {
    throw error;
  }

}

async function getCourse(name){

  let courses = await getCourses();
  for (let course of courses.data) {
    if (course.name == name) {
      return course.id;
    }
  }
}

module.exports.createEvent = async (event) => {

  let groupCategorieID;

  let courseID = await getCourse("Events");

  let data = {
    "name": event.name,
    "description": event.description,
    "sis_group_id": event.UUID
  };

  try {
    let groupCategories = await getGroupCategorys(courseID);
    for (let groupCategorie of groupCategories.data) {
        if (groupCategorie.name == "Events") {
           groupCategorieID = groupCategorie.id;
          }
        }
     response = await createGroup(groupCategorieID, data);
     return response.status;
  }
  catch(error){
    throw error;
  }
}

module.exports.updateEvent = async (event) => {
  
  let data = {
      "name": event.name,
      "description": event.description,
  };

  try {
    response = await updateGroup(event.UUID, data);
    return response.status;
  }

  catch(error){
    throw error;
  }
}

module.exports.deleteEvent = async (event) => {

  try {
    response = await deleteGroup(event.UUID);
    return response.status;
  }

  catch(error){
    throw error;
  }
}