const {pool} = require("../Db/db.js");

module.exports.uuid_exists = (UUID, source, entitytype) => {

  // check if the uuid_exists
  return new Promise((resolve,reject) => 
  pool.query(`SELECT * FROM ${process.env.MASTERUUID} WHERE uuid = UUID_TO_BIN(?) AND source = ? AND EntityType = ? `,[UUID, source, entitytype], function (error, results) {
      if (error){
        reject(error);
      }
        resolve(results);
    })).then(results => results.length > 0);
}

module.exports.new_version = (UUID,entityversion, source, entitytype, source_entityID) => {

  // check the entityversion
  return new Promise((resolve,reject) =>
  pool.query(`SELECT * FROM ${process.env.MASTERUUID} WHERE uuid = UUID_TO_BIN(?) AND source = ? AND EntityType = ? AND Source_EntityID = ?`, [UUID,source,entitytype, source_entityID], function (error, results) {
    if (error){
      reject(error);
    }
    resolve(results);
  })).then(results => results[0].EntityVersion < entityversion)
  .catch(error => console.log(error));
}

module.exports.insert_into_uuid = async(UUID,entitytype,source,source_entityID) => {

  //insert into masterUUID
  return new Promise((resolve,reject) =>
       pool.query(`INSERT INTO ${process.env.MASTERUUID}(UUID, Source_EntityID, EntityType, EntityVersion,Source) VALUES(UUID_TO_BIN(?),?,?,1,?)`,[UUID,source_entityID,entitytype,source], function(error,results){
         if (error){
           reject(error);
        }
      resolve(results);
      }));
}

module.exports.update = async(UUID,entitytype,entityversion,source,source_entityID) => {

  // update the masterUUID
  return new Promise((resolve,reject) =>
  pool.query(`UPDATE ${process.env.MASTERUUID} SET entityversion = ? WHERE UUID = UUID_TO_BIN(?) AND source = ? AND entitytype = ? AND Source_EntityID = ?` , [entityversion
  , UUID,source ,entitytype, source_entityID],function(error,results){
      if (error){
         reject(error);
      }
      resolve(results);
  })).catch(err => console.log(err));
}

module.exports.delete_uuid = async(UUID,source,entitytype) => {

  // delete row from the masterUUID
  return new Promise((resolve,reject) =>
  pool.query(`DELETE FROM ${process.env.MASTERUUID} WHERE UUID = UUID_TO_BIN(?) AND Source = ? AND EntityType = ?` , [UUID,source,entitytype],function(error,results){
        if (error){
           reject(error);
        }
        resolve(results);
    })
  );
}
