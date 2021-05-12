const axios = require('axios');

require('dotenv').config();

const create_users_url = "http://10.3.56.4/api/v1/accounts/1/users"

const get_user_url = "http://10.3.56.4/api/v1/users/sis_user_id:"

const headers = {
    "Content-type": "application/json",
    "Authorization": `Bearer ${process.env.API_token}`
}

// enrollment endpoint (The sis_course_id = uuid = JriMOZgusPGbGtcm5ssDfGhRQRvFCgT0Pc4FDh8S)
const get_course_event = "http://10.3.56.4/api/v1/courses/sis_course_id:JriMOZgusPGbGtcm5ssDfGhRQRvFCgT0Pc4FDh8S/enrollments" 

module.exports.create_user = async (firstname, lastname, email, UUID) => {
    // First create the user and automatically enroll that user to the course events (similar to intranet)

    // config for creating the user
    const config = {

        params: {
            "user[name]": `${firstname} ${lastname}`,
            "user[short_name]": firstname,
            "user[sortable_name]": lastname,
            "pseudonym[unique_id]": email,
            "pseudonym[sis_user_id]": UUID
        },
        headers: {
            ...headers
        }
    }

    try {
        // create the user
        let res_create = await axios.post(create_users_url, null, config);

        // when the user is created => enrollment of user to course Events
        let create_enrollment = await axios.post(`${get_course_event}?enrollment[user_id]=sis_user_id:${UUID}&enrollment[type]=StudentEnrollment`, null,{headers});
        return res_create.status;
    } catch (err) {
        console.log(err);
    }
 }

module.exports.update_user = async (firstname, lastname, email, UUID) => {

    const config = {
        params: {
            "user[name]": `${firstname} ${lastname}`,
            "user[short_name]": firstname,
            "user[sortable_name]": lastname,
            "pseudonym[unique_id]": email
        },
        headers: {
            ...headers
        }
    }

    try {
        let res_update = await axios.put(`${get_user_url}${UUID}`, null, config);
        return res_update.status;
    } 
    
    catch (err) {
        console.log(err);
    }
}

module.exports.delete_user = async (UUID) => {

    try {
        let res_delete = await axios.delete(`${get_user_url}${UUID}`, { headers });
        return res_delete.status;
    } 
    catch (err) {
        console.log(err);
    }
}
