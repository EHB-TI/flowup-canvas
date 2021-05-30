const { delete_user,create_user,update_user } = require("../API/users");

class UserHelper {

    constructor(){
    }

    static handle(user,method){

        if (method === "CREATE"){
            return create_user(user.firstname,user.lastname,user.email); 
        }

        else if (method === "UPDATE"){
            console.log("inside");
            console.log(user.email);
            return update_user(user.firstname,user.lastname,user.email,user.id);
        }

        else if (method === "DELETE") {
            return delete_user(user.id);
        }
    }
}

module.exports.UserHelper = UserHelper;