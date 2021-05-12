const axios = require('axios');
require('dotenv').config();

const headers = {
    "Content-type": "application/json",
    "Authorization": `Bearer ${process.env.API_token}`
}

const get_group = "http://10.3.56.4/api/v1/groups/sis_group_id:";

const get_user = "http://10.3.56.4/api/v1/users/sis_user_id:";

const fetch_user = async(user_uuid) => {
    const res = await axios.get(`${get_user}${user_uuid}`, {headers});
    return res.data.id;
}

module.exports.add_user_to_event = async(event_uuid, user_uuid) => {

    //fetch the user_id 
    const id = await fetch_user(user_uuid);

    // put it into config
    const config = {
        params: {
          "user_id" : id
        },
        headers: {
            ...headers
        }
    }

    // create a membership 
    try {
        await axios.post(`${get_group}${event_uuid}/memberships`, null, config);
    }
   
    catch(err){
        console.log(err);
    }    

}

module.exports.remove_user_from_event = async(event_uuid, user_uuid) => {

    // Remove the user from the group 

    try {
        await axios.delete(`http://10.3.56.4//api/v1/groups/sis_group_id:${event_uuid}/users/sis_user_id:${user_uuid}`, {headers});
    }
   
    catch(err){
        console.log(err);
    }    

}