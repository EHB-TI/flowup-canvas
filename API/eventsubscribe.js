const {axios, querystring} = require('./axios_config.js');

const get_group_endpoint = "/groups/sis_group_id:";

const get_user_endpoint = "/users/sis_user_id:";

const memberships_endpoint = "/memberships";

const fetch_user = async(user_uuid) => {
    const res = await axios.get(`${get_user_endpoint}${user_uuid}`);
    return res.data.id;
}

module.exports.add_user_to_event = async(event_uuid, user_uuid) => {

    //fetch the user_id 
    const id = await fetch_user(user_uuid);

    // create a membership 
    try {
        let res = await axios.post(`${get_group_endpoint}${event_uuid}${memberships_endpoint}`, querystring.stringify({user_id: id}));
        return res.data.id;
    }
   
    catch(err){
        console.log(err);
    }    

}

module.exports.remove_user_from_event = async(event_uuid, user_uuid) => {

    // Remove the user from the group 
    try {
        await axios.delete(`${get_group_endpoint}${event_uuid}${get_user_endpoint}${user_uuid}`);
    }
   
    catch(err){
        console.log(err);
    }    

}