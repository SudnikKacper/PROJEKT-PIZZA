// połączenie z bazą danych

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'pizza' // schema
});

module.exports = connection;
