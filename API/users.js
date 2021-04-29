const axios = require('axios');

require('dotenv').config();

const delete_user_url = "http://10.3.56.4/api/v1/accounts/1/users"

const create_users_url = "http://10.3.56.4/api/v1/accounts/1/users"

const edit_user_url = "http://10.3.56.4/api/v1/users"

const get_all_users_url = "http://10.3.56.4/api/v1/accounts/1/users"

const headers = {
    "Content-type": "application/json",
    "Authorization": `Bearer ${process.env.API_token}`
}

const findObject = (array,email) => {

    for (let obj of array) {
        if (obj.login_id === email) {
            return obj;
        }
    }

    return undefined;
}

module.exports.create_user = async (firstname, lastname, email) => {

    const config = {

        params: {
            "user[name]": `${firstname} ${lastname}`,
            "user[short_name]": firstname,
            "user[sortable_name]": lastname,
            "pseudonym[unique_id]": email,
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

module.exports.update_user = async (firstname, lastname, email) => {

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
        const res = await axios.get(get_all_users_url, { headers });
        let obj = findObject(res.data, email);

        if (obj === undefined){
            console.log("Object not found");
        }

        else {
            let res_update = await axios.put(`${edit_user_url}/${obj.id}`, null, config);
            console.log(res_update.data);
        }
    } 
    
    catch (err) {
        console.log(err);
    }
}

module.exports.delete_user = async (email) => {

    try {
        const res = await axios.get(get_all_users_url, { headers });
        let obj = findObject(res.data, email);

        if (obj === undefined){
            console.log("Object not found");
        }

        else {
           let res_delete = await axios.delete(`${delete_user_url}/${obj.id}`, { headers });
           console.log(res_delete.data);
        }
    } 
    
    catch (err) {
        console.log(err);
    }
}
