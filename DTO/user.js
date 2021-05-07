class User {
    
    constructor(firstname,lastname,email,UUID){
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.UUID = UUID;
    }
}

module.exports.User = User