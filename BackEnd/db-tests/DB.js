const http = require('http');
const mysql = require('mysql');

// Konfiguracja połączenia z bazą danych MySQL
const connection = require('./AccesDB');

// Nawiązanie połączenia z bazą danych
connection.connect((err) => {
    if (err) throw err;
    console.log('Połączono z bazą danych MySQL!');

    displayDetailedView();
});

function displayDetailedView() {
    const query = `
        SELECT Pizza.id AS pizzaId, Pizza.nazwa AS nazwa_pizzy, Pizza.cena, Skladniki.id AS skladnikId, Skladniki.nazwa AS nazwa_skladnika
        FROM Pizza
        JOIN PizzaSkladniki ON Pizza.id = PizzaSkladniki.pizzaId
        JOIN Skladniki ON PizzaSkladniki.skladnikId = Skladniki.id
    `;

    connection.query(query, (err, rows) => {
        if (err) throw err;
        console.log('Szczegółowe widoki z połączonymi danymi:');

        rows.forEach((row) => {
            console.log(row);
        });
    });
}