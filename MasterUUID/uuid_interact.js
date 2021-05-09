const {pool, pool2} = require("../Db/db.js");

module.exports.uuid_exists = (UUID, source, entitytype) => {
  // check if the uuid_exists
  return new Promise((resolve,reject) => 
  pool.query('SELECT * FROM VoorbeeldTabel WHERE uuid = UUID_TO_BIN(?) AND source = ? AND EntityType = ?',[UUID, source, entitytype], function (error, results) {
      if (error){
        reject(error);
      }
        resolve(results);
    })).then(results => results.length > 0);
}


module.exports.new_version = (UUID,entityversion, source, entitytype) => {

  // check the entityversion
  return new Promise((resolve,reject) =>
  pool.query('SELECT * FROM VoorbeeldTabel WHERE uuid = UUID_TO_BIN(?) AND source = ? AND EntityType = ?', [UUID,source,entitytype], function (error, results) {
    if (error){
      reject(error);
    }
    resolve(results);
  })).then(results => results[0].EntityVersion < entityversion)
  .catch(error => console.log(error));
}

const get_source_entityID = (uuid) => {

  // query local DB
    return new Promise((resolve,reject) => {
       pool2.query("SELECT id FROM SourceEntityTable WHERE UUID = UUID_TO_BIN(?)", [uuid],(error, results) => {       
        if (error){
           reject(error);
         }
 
        if (results.length > 0){
          resolve(results[0].id);
        }
        else{
          resolve(undefined);
        }
       });
    });

}

module.exports.insert_into_uuid = async(UUID,entitytype,source) => {

  // fetch the source entity ID from our local DB
  let source_entityID = await get_source_entityID(UUID);

  // if we don't have a source entity ID for our object 
  if (source_entityID === undefined){

    // insert it first into our local DB
     await insert_into_local_db(UUID);

     // Fetch the source_entity ID again
     source_entityID = await get_source_entityID(UUID);
  }

  //insert into masterUUID
  return new Promise((resolve,reject) =>
       pool.query('INSERT INTO VoorbeeldTabel(UUID, Source_EntityID, EntityType, EntityVersion,Source) VALUES(UUID_TO_BIN(?),?,?,1,?)',[UUID,source_entityID,entitytype,source], function(error,results){
         if (error){
           reject(error);
        }
      resolve(results);
      }));
}

const insert_into_local_db = (UUID) => {
  
  return new Promise((resolve,reject) => {
    pool2.query("INSERT INTO SourceEntityTable VALUES(?,UUID_TO_BIN(?))", [undefined,UUID],(error, results) => {       
     if (error){
        reject(error);
      }
      resolve(results);
    });
 });
}

module.exports.update = async(UUID,entitytype,entityversion,source) => {

  // fetch the source entity ID from our local DB
  let source_entityID = await get_source_entityID(UUID);

  // update the masterUUID
  return new Promise((resolve,reject) =>
  pool.query('UPDATE VoorbeeldTabel SET entityversion = ? WHERE UUID = UUID_TO_BIN(?) AND source = ? AND entitytype = ? AND Source_EntityID = ?' , [entityversion
  , UUID,source ,entitytype, source_entityID],function(error,results){
      if (error){
         reject(error);
      }
      resolve(results);
  })).catch(err => console.log(err));
}

module.exports.delete_uuid = async(UUID,source,entitytype) => {


  // fetch the source entity ID from our local DB
  let source_entityID = await get_source_entityID(UUID);

  // delete row from the masterUUID
  return new Promise((resolve,reject) =>
  pool.query('DELETE FROM VoorbeeldTabel WHERE UUID = UUID_TO_BIN(?) AND Source = ? AND Source_EntityID = ? AND EntityType = ?' , [UUID,source,source_entityID,entitytype],function(error,results){
        if (error){
           reject(error);
        }
        resolve(results);
    })
  ).then(
    pool2.query('DELETE FROM SourceEntityTable WHERE UUID = UUID_TO_BIN(?)' , [UUID],function(error,results){
      if (error){
         throw error;
      }
  })
  );
}
