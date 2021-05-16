const { delete_user,create_user,update_user } = require("../API/users");

class UserHelper {

    constructor(){
    }

    static handle(user,method){

        if (method === "CREATE"){
            return create_user(user.firstname,user.lastname,user.email,user.UUID); 
        }

        else if (method === "UPDATE"){
            return update_user(user.firstname,user.lastname,user.email,user.UUID);
        }

        else if (method === "DELETE") {
            return delete_user(user.UUID);
        }
    }
}

module.exports.UserHelper = UserHelper;