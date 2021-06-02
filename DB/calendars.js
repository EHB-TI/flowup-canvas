const {pool} = require("./db.js");

module.exports.calendar_id_in_localdb = (event_id) => {

  // check if the calendar_id exists
  return new Promise((resolve,reject) => 
  pool.query(`SELECT calendar_id FROM ${process.env.CALENDARSTABLE} WHERE event_id = ? `,[event_id], function (error, results) {
      if (error){
        reject(error);
      }
        resolve(results);
    })).then(results => results.length > 0);
}

module.exports.insert_into_localdb = async(event_id, calendar_id) => {

  //insert into local db
  return new Promise((resolve,reject) =>
       pool.query(`INSERT INTO ${process.env.CALENDARSTABLE}(event_id, calendar_id) VALUES(?,?)`,[event_id,calendar_id], function(error,results){
         if (error){
           reject(error);
        }
      resolve(results);
      }));
}

module.exports.get_calendar_id = async(event_id) => {

  // get the calendar_id back
  return new Promise((resolve,reject) =>
  pool.query(`SELECT calendar_id FROM ${process.env.CALENDARSTABLE} WHERE event_id = ?` , [event_id],function(error,results){
      if (error){
         reject(error);
      }
      resolve(results[0].calendar_id);
  })).catch(err => console.log(err));
}

module.exports.delete_calendar = async(event_id,calendar_id) => {

  // delete row from our local db
  return new Promise((resolve,reject) =>
  pool.query(`DELETE FROM ${process.env.CALENDARSTABLE} WHERE event_id = ? AND calendar_id = ?` , [event_id,calendar_id],function(error,results){
        if (error){
           reject(error);
        }
        resolve(results);
    })
  );
}