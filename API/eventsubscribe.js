const {axios, querystring} = require('./axios_config.js');

const get_group_endpoint = "/groups/";

const get_user_endpoint = "/users/";

const memberships_endpoint = "/memberships";
 
module.exports.add_user_to_event = async(event_id, user_id) => {

    // Add the user to the group (create a membership) 
    try {
        let res = await axios.post(`${get_group_endpoint}${event_id}${memberships_endpoint}`, querystring.stringify({user_id: user_id}));
        return res.data.id;
    }
   
    catch(err){
        console.log(err);
    }    

}

module.exports.remove_user_from_event = async(event_id, user_id) => {

    // Remove the user from the group 
    try {
        await axios.delete(`${get_group_endpoint}${event_id}${get_user_endpoint}${user_id}`);
    }
   
    catch(err){
        console.log(err);
    }    

}