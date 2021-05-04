const axios = require('axios');

require('dotenv').config();

const create_users_url = "http://10.3.56.4/api/v1/accounts/1/users"

const get_user_url = "http://10.3.56.4/api/v1/users/sis_user_id:"

const headers = {
    "Content-type": "application/json",
    "Authorization": `Bearer ${process.env.API_token}`
}

module.exports.create_user = async (firstname, lastname, email, UUID) => {

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
        await axios.post(create_users_url, null, config);
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
        return res_update.status
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
