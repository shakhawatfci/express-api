// database connection 

const sqlite3 = require('sqlite3');
const path = require('path');
const db = new sqlite3.Database(process.env.TEST_DATABASE ||
 path.resolve(__dirname,'../database.sqlite3'));

module.exports = db;