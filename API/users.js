const {axios, querystring} = require('./axios_config.js');

const create_user_endpoint = "/accounts/1/users";

const get_user_endpoint = "/users/sis_user_id:";

// enrollment endpoint
const get_eventcourse_enrollments_endpoint = `/courses/sis_course_id:${process.env.SIS_EVENTCOURSE_ID}/enrollments`;

module.exports.create_user = async (firstname, lastname, email, UUID) => {
    // First create the user and automatically enroll that user to the course events (similar to intranet)

    // query string parameters for creating a user
    const user_params = {
        "user[name]": `${firstname} ${lastname}`,
        "user[short_name]": firstname,
        "user[sortable_name]": lastname,
        "pseudonym[unique_id]": email,
        "pseudonym[sis_user_id]": UUID
    }

    const enrollment_params = {
        "enrollment[user_id]": `sis_user_id:${UUID}`,
        "enrollment[type]": "StudentEnrollment"
    }

    try {
        // create the user
        let res_create = await axios.post(create_user_endpoint,querystring.stringify({...user_params}));

        // when the user is created => enrollment of user to course Events
        await axios.post(get_eventcourse_enrollments_endpoint,querystring.stringify({...enrollment_params}));
        return res_create.data.id;
    } 
    catch (err) {
        console.log(err);
    }
 }

module.exports.update_user = async (firstname, lastname, email, UUID) => {

    // query string parameters for changing the user
    const params =  {
        "user[name]": `${firstname} ${lastname}`,
        "user[short_name]": firstname,
        "user[sortable_name]": lastname,
        "pseudonym[unique_id]": email
    }

    try {
        let res_update = await axios.put(`${get_user_endpoint}${UUID}`, querystring.stringify({...params}));
        return res_update.data.id;
    } 
    
    catch (err) {
        console.log(err);
    }
}

module.exports.delete_user = async (UUID) => {

    try {
        let res_delete = await axios.delete(`${get_user_endpoint}${UUID}`);
        return res_delete.status;
    } 
    catch (err) {
        console.log(err);
    }
}
