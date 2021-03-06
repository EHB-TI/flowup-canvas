const mysql = require('mysql');

require('dotenv').config();

const pool  = mysql.createPool({
  host: process.env.HOST,
  user: "root",
  password: process.env.PASSWORD,
  database: process.env.DB
});

// pool for our local db
module.exports.pool = pool;