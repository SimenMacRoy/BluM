const mysql = require('mysql2');
require('dotenv').config(); // Make sure environment variables are loaded

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) {
        return console.error('error connecting: ' + err.stack);
    }
    console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
