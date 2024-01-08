const mysql = require('mysql');


const connection = require('./AccesDB');

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database.');

    // Perform a simple query to check if the database is responsive
    connection.query('SELECT 1', (err, results) => {
        if (err) {
            console.error('Error pinging database:', err);
        } else {
            console.log('Database ping successful:', results);
        }
        connection.end(); // Close the connection
    });
});
