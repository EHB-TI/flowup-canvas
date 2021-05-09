const {uuid_exists, new_version, insert_into_uuid, update, delete_uuid} = require("./uuid_interact.js");

class UUIDHelper {

    constructor(){ 
    }

    async handleDb(uuid,source,entitytype,entityversion,method){

    // If the method is DELETE , remove the row from the table
       if (method === "DELETE"){
        await delete_uuid(uuid,source,entitytype);
       }

       let exists = await uuid_exists(uuid,source,entitytype);
       // Check if the uuid exists in the masterUUID
       if (exists){
        // if it exists we check if the entityversion is greater than the current one
        let is_new = await new_version(uuid,entityversion,source,entitytype);

        // if the entityversion is greater than the current one we know that we have to update the masterUUID table (else do nothing)
        if (is_new){
            await update(uuid,entitytype,entityversion,source);
        }
       }
       // if it does not exist we add a row to the masterUUID table (with version 1)
       else {
          await insert_into_uuid(uuid,entitytype,source);
       }
    }
}

module.exports.UUIDHelper = UUIDHelper;
