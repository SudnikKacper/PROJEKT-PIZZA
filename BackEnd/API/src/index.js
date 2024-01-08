const express = require('express')
const app = express()
const port = 9951
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'pizza' // schema
});

let count = 0;


app.get('/getAll/Pizze', (req, res) => {
    displayDetailedView((jsonData) => {
        res.json(jsonData); // Zwracanie danych w formacie JSON jako odpowiedź na zapytanie HTTP
    });
});

app.get('/getAll/Zamowienia', (req, res) => {
    const query = `
    SELECT Zamowienie.id AS orderId, Zamowienie.imie AS klient, Zamowienie.status, Zamowienie.przewidywanaDostawa,
           ZamowionePrzedmioty.id AS orderedItemId, ZamowionePrzedmioty.nazwa AS pizzaName, ZamowionePrzedmioty.ilosc,
           ZamowionePrzedmioty.cenaSzt, ZamowionePrzedmioty.razem
    FROM Zamowienie
    JOIN ZamowionePrzedmioty ON Zamowienie.id = ZamowionePrzedmioty.orderId
  `;

    connection.query(query, (err, rows) => {
        if (err) throw err;

        const orders = {};

        rows.forEach((row) => {
            const {
                orderId, klient, status, przewidywanaDostawa,
                orderedItemId, pizzaName, ilosc, cenaSzt, razem
            } = row;

            if (!orders[orderId]) {
                orders[orderId] = {
                    orderId,
                    klient,
                    status,
                    przewidywanaDostawa,
                    items: []
                };
            }

            orders[orderId].items.push({
                orderedItemId,
                pizzaName,
                ilosc,
                cenaSzt,
                razem
            });
        });

        const orderData = Object.values(orders);

        res.json(orderData);
    });
});

// Wyświetlenie listy wszystkich rekordów dla każdej tabeli
app.get('/getAllRecords', (req, res) => {
    const tables = [
        'Pizza',
        'PizzaSkladniki',
        'Skladniki',
        'User',
        'Zamowienie',
        'ZamowionePrzedmioty'
    ];

    const allData = {};

    tables.forEach((tableName) => {
        connection.query(`SELECT * FROM ${tableName}`, (err, rows) => {
            if (err) throw err;
            allData[tableName] = rows;
            if (Object.keys(allData).length === tables.length) {
                res.json(allData);
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})




function displayDetailedView(callback) {
    const query = `
        SELECT Pizza.id AS pizzaId, Pizza.nazwa AS nazwa_pizzy, Pizza.cena, Skladniki.id AS skladnikId, Skladniki.nazwa AS nazwa_skladnika
        FROM Pizza
        JOIN PizzaSkladniki ON Pizza.id = PizzaSkladniki.pizzaId
        JOIN Skladniki ON PizzaSkladniki.skladnikId = Skladniki.id
    `;

    connection.query(query, (err, rows) => {
        if (err) throw err;

        const formattedData = rows.reduce((acc, row) => {
            const { pizzaId, nazwa_pizzy, cena, skladnikId, nazwa_skladnika } = row;

            if (!acc[pizzaId]) {
                acc[pizzaId] = {
                    pizzaId,
                    nazwa_pizzy,
                    cena,
                    skladniki: []
                };
            }

            acc[pizzaId].skladniki.push({ skladnikId, nazwa_skladnika });
            return acc;
        }, {});

        const jsonData = Object.values(formattedData);

        if (callback && typeof callback === 'function') {
            callback(jsonData); // Wywołanie funkcji zwrotnej z danymi w formacie JSON
        }
    });
}
