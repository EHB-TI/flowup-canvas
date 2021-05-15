const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

// axios default configuration that will be applied for each request 

axios.defaults.headers.common["Authorization"] = `Bearer ${process.env.API_token}`
axios.defaults.headers.common["Content-type"] = "application/json"

axios.defaults.baseURL = process.env.BASEURL;

module.exports.axios = axios;
module.exports.querystring = querystring;