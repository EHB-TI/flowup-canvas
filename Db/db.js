const mysql = require('mysql');

require('dotenv').config();

const pool  = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
});

const pool2 = mysql.createPool({
  host: process.env.HOST2,
  user: process.env.USER2,
  password: process.env.PASSWORD2,
  database: process.env.DB2,
  port: process.env.PORT
});

// pool for the MasterUUID DB
module.exports.pool = pool;

// pool for our local mysql DB
module.exports.pool2 = pool2;
