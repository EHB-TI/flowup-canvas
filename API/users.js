const { axios, querystring } = require('./axios_config.js');

const create_user_endpoint = "/accounts/1/users";

const get_user_endpoint = "/users/";

// enrollment endpoint
const get_eventcourse_enrollments_endpoint = `/courses/sis_course_id:${process.env.SIS_EVENTCOURSE_ID}/enrollments`;

module.exports.create_user = async (firstname, lastname, email) => {
    // First create the user and automatically enroll that user to the course events (similar to intranet)

    // query string parameters for creating a user
    const user_params = {
        "user[name]": `${firstname} ${lastname}`,
        "user[short_name]": firstname,
        "user[sortable_name]": lastname,
        "pseudonym[unique_id]": email,
    }
    try {
        // create the user
        let res_create = await axios.post(create_user_endpoint, querystring.stringify({ ...user_params }));

        // check if the user is succesfully created 
        if (res_create.status === 200) {

            let user_id = res_create.data.id;
            // if the user is created we enroll him to the course events
            const enrollment_params = {
                "enrollment[user_id]": `${user_id}`,
                "enrollment[type]": "StudentEnrollment"
            }

            // when the user is created => enrollment of user to course Events
            await axios.post(get_eventcourse_enrollments_endpoint, querystring.stringify({...enrollment_params }));
            return user_id;

        }
        return undefined;
    } 
    catch (err) {
        console.log(err);
    }
}

module.exports.update_user = async (firstname, lastname, email, id) => {

    // query string parameters for changing the user
    const params = {
        "user[name]": `${firstname} ${lastname}`,
        "user[short_name]": firstname,
        "user[sortable_name]": lastname,
        "pseudonym[unique_id]": email
    }

    try {
        let res_update = await axios.put(`${get_user_endpoint}${id}`, querystring.stringify({ ...params }));
        return res_update.data.id;
    } 
    catch (err) {
        console.log(err);
    }
}

module.exports.delete_user = async (id) => {

    try {
    let response = await axios.delete(`${get_user_endpoint}${id}`);

    

    // check if the user is properly deleted
    if (response.status === 200){
        return response.data.status;
     }

    } catch (err) {
        console.log(err);
    }
}