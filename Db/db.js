const mysql = require('mysql');

require('dotenv').config();

const pool  = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
});

// pool for the MasterUUID DB
module.exports.pool = pool;

