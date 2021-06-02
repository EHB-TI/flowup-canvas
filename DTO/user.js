class User {
    
    constructor(firstname,lastname,email,id){
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email.split("@")[0] + "@flowupdesiderius.onmicrosoft.com";
        this.id = id;
    }
}
module.exports.User = User
