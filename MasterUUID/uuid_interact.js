const pool = require("../Db/db.js");

module.exports.uuid_exists = (UUID, source) => {
  return new Promise((resolve,reject) => 
  pool.query('SELECT * FROM VoorbeeldTabel WHERE uuid = UUID_TO_BIN(?) AND source = ?',[UUID, source], function (error, results) {
      if (error){
        reject(error);
      }
        resolve(results);
    })).then(results => results.length > 0);
}


module.exports.new_version = (UUID,entityversion, source) => {
  return new Promise((resolve,reject) =>
  pool.query('SELECT * FROM VoorbeeldTabel WHERE uuid = UUID_TO_BIN(?) AND source = ?', [UUID,source], function (error, results) {
    if (error){
      reject(error);
    }
    resolve(results);
  })).then(results => results[0].EntityVersion < entityversion)
  .catch(error => console.log(error));
}

module.exports.insert = (sourceEntityID,entitytype,source) => {
  return new Promise((resolve,reject) =>
  pool.query('INSERT INTO VoorbeeldTabel VALUES(UUID_TO_BIN(UUID()),?,?,1,?)',[sourceEntityID,entitytype,source], function(error,results){
        if (error){
           reject(error);
        }
        resolve(results);
    }));
}

module.exports.update = (UUID,entitytype,entityversion,source) => {
  return new Promise((resolve,reject) =>
  pool.query('UPDATE VoorbeeldTabel SET entityversion = ? WHERE UUID = UUID_TO_BIN(?) AND source = ? AND entitytype = ?' , [entityversion
  , UUID,source ,entitytype],function(error,results){
      if (error){
         reject(error);
      }
      resolve(results);
  })).catch(err => console.log(err));
}
