//TODO Weryfikacja danych

const express = require('express')
const cors = require('cors')
const app = express()
const port = 9951
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'pizza' // schema
});

app.use(cors('*'))

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const corsOpts = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}
app.get('/getAll/Pizze', cors(corsOpts), (req, res) => {
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

app.get('/getPizza/:pizzaId', (req, res) => {
    const { pizzaId } = req.params;

    connection.query('SELECT * FROM Pizza WHERE id = ?', pizzaId, (err, rows) => {
        if (err) {
            console.error('Error fetching pizza by id:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (rows.length === 0) {
                res.status(404).json({ error: 'Pizza not found' });
            } else {
                const pizzaData = rows[0];
                res.json(pizzaData);
            }
        }
    });
});

app.put('/updatePizza/:id', (req, res) => {
    const pizzaId = req.params.id;
    const { nazwa, cena, img, dostepne } = req.body;

    const updatePizzaQuery = `
        UPDATE Pizza
        SET nazwa = ?,
            cena = ?,
            img = ?,
            dostepne = ?
        WHERE id = ?
    `;

    connection.query(updatePizzaQuery, [nazwa, cena, img, dostepne, pizzaId], (err, result) => {
        if (err) {
            console.error("Error updating pizza:", err);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            res.status(200).json({ message: "Pizza updated successfully" });
        }
    });
});
app.get('/getPizza/:id/s', (req, res) => {
    const { id } = req.params;
    const pizzaId = parseInt(id, 10);

    connection.query('SELECT nazwa FROM Pizza WHERE id = ?', pizzaId, (err, rows) => {
        if (err) {
            console.error('Error fetching pizza by id:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (rows.length === 0) {
                res.status(404).json({ error: 'Pizza not found' });
            } else {
                const pizzaName = rows[0].nazwa;

                connection.query('SELECT id, nazwa FROM Skladniki', (err, skladnikiRows) => {
                    if (err) {
                        console.error('Error fetching ingredients:', err);
                        res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        connection.query('SELECT skladnikId FROM PizzaSkladniki WHERE pizzaId = ?', pizzaId, (err, pizzaSkladnikiRows) => {
                            if (err) {
                                console.error('Error fetching pizza ingredients:', err);
                                res.status(500).json({ error: 'Internal Server Error' });
                            } else {
                                const selectedIngredients = pizzaSkladnikiRows.map(row => row.skladnikId);
                                const ingredients = skladnikiRows.map(skladnik => ({ id: skladnik.id, nazwa: skladnik.nazwa, selected: selectedIngredients.includes(skladnik.id) }));

                                res.json({ pizzaName, ingredients });
                            }
                        });
                    }
                });
            }
        }
    });
});

app.put('/updatePizzaIngredients/:id', (req, res) => {
    const pizzaId = req.params.id;
    const selectedIngredients = req.body.ingredients;

    const deletePizzaIngredientsQuery = 'DELETE FROM PizzaSkladniki WHERE pizzaId = ?';

    connection.query(deletePizzaIngredientsQuery, [pizzaId], (err) => {
        if (err) {
            console.error('Error deleting pizza ingredients:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (selectedIngredients.length > 0) {
                const insertPizzaIngredientsQuery = 'INSERT INTO PizzaSkladniki (skladnikId, pizzaId) VALUES ?';
                const values = selectedIngredients.map(skladnikId => [skladnikId, pizzaId]);

                connection.query(insertPizzaIngredientsQuery, [values], (err) => {
                    if (err) {
                        console.error('Error inserting pizza ingredients:', err);
                        res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        res.status(200).json({ message: 'Pizza ingredients updated successfully' });
                    }
                });
            } else {
                res.status(200).json({ message: 'Pizza ingredients updated successfully' });
            }
        }
    });
});

app.post('/addPizza', (req, res) => {
    const { nazwa, cena, img, dostepne, skladniki } = req.body;

    // Prosta walidacja: sprawdź, czy wszystkie wymagane pola są dostępne
    if (!nazwa || !cena || !img || dostepne === undefined) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    // Dodatkowa walidacja: sprawdź, czy cena jest liczbą
    if (isNaN(cena)) {
        res.status(400).json({ error: "Invalid price format" });
        return;
    }

    // Pobierz maksymalne id z tabeli Pizza
    connection.query('SELECT MAX(id) AS maxId FROM Pizza', (maxIdErr, maxIdResult) => {
        if (maxIdErr) {
            console.error("Error getting max id:", maxIdErr);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        // Uzyskaj nowy id dla nowej pizzy (maksymalne id + 1)
        const newPizzaId = maxIdResult[0].maxId + 1;

        // Wstaw nową pizzę
        const addPizzaQuery = `
            INSERT INTO Pizza (id, nazwa, cena, img, dostepne)
            VALUES (?, ?, ?, ?, ?)
        `;

        connection.query(addPizzaQuery, [newPizzaId, nazwa, cena, img, dostepne], (addPizzaErr) => {
            if (addPizzaErr) {
                console.error("Error adding pizza:", addPizzaErr);
                res.status(500).json({ error: "Internal Server Error" });
            } else {
                if (skladniki && skladniki.length > 0) {
                    const addPizzaIngredientsQuery = `
                        INSERT INTO PizzaSkladniki (skladnikId, pizzaId)
                        VALUES ?
                    `;

                    const values = skladniki.map((skladnikId) => [skladnikId, newPizzaId]);

                    // Dodaj składniki dla nowej pizzy
                    connection.query(addPizzaIngredientsQuery, [values], (addIngredientsErr) => {
                        if (addIngredientsErr) {
                            console.error("Error adding pizza ingredients:", addIngredientsErr);
                            res.status(500).json({ error: "Internal Server Error" });
                        } else {
                            res.status(200).json({ message: "Pizza added successfully" });
                        }
                    });
                } else {
                    res.status(200).json({ message: "Pizza added successfully" });
                }
            }
        });
    });
});
app.delete('/deletePizza/:id', (req, res) => {
    const pizzaId = req.params.id;

    // Usuń składniki powiązane z pizzą
    const deletePizzaIngredientsQuery = `
        DELETE FROM PizzaSkladniki
        WHERE pizzaId = ?
    `;

    connection.query(deletePizzaIngredientsQuery, [pizzaId], (deleteIngredientsErr) => {
        if (deleteIngredientsErr) {
            console.error("Error deleting pizza ingredients:", deleteIngredientsErr);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            // Usuń pizzę
            const deletePizzaQuery = `
                DELETE FROM Pizza
                WHERE id = ?
            `;

            connection.query(deletePizzaQuery, [pizzaId], (deletePizzaErr) => {
                if (deletePizzaErr) {
                    console.error("Error deleting pizza:", deletePizzaErr);
                    res.status(500).json({ error: "Internal Server Error" });
                } else {
                    res.status(200).json({ message: "Pizza deleted successfully" });
                }
            });
        }
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
function displayDetailedView(callback) {
    const query = `
        SELECT Pizza.id AS pizzaId, Pizza.nazwa AS nazwa_pizzy, Pizza.cena, Pizza.img, Skladniki.id AS skladnikId, Skladniki.nazwa AS nazwa_skladnika
        FROM Pizza
                 JOIN PizzaSkladniki ON Pizza.id = PizzaSkladniki.pizzaId
                 JOIN Skladniki ON PizzaSkladniki.skladnikId = Skladniki.id
    `;

    connection.query(query, (err, rows) => {
        if (err) throw err;

        const formattedData = rows.reduce((acc, row) => {
            const { pizzaId, nazwa_pizzy, cena, img, skladnikId, nazwa_skladnika } = row;

            if (!acc[pizzaId]) {
                acc[pizzaId] = {
                    pizzaId,
                    nazwa_pizzy,
                    cena,
                    img, // Dodane pole img
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