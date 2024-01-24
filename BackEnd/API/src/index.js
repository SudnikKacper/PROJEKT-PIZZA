const express = require('express')
const cors = require('cors')
const app = express()
const port = 9951
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const dayjs = require('dayjs')
const {body, validationResult, param} = require("express-validator");

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'pizza' // schema
});



app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(
    session({
        key: "userId",
        secret: "subscribe",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 1000 // 3600s
        },
    })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());



app.get('/getAll/Pizze', (req, res) => {
    displayDetailedView((jsonData) => {
        res.json(jsonData);
    });
});

app.post(
    '/addOrder',
    [
        // Validate userId as integer
        body('userId').isInt(),

        // Validate customerName as string
        body('customerName').isString(),

        // Validate status as boolean
        body('status').isBoolean(),

        // Validate priority as integer (0 or 1)
        body('priority').isIn([0, 1]).toInt(),

        // Validate deliveryTime as a date in the future
        body('deliveryTime').isAfter(),

        // Validate cartContent as not empty
        body('cartContent').isArray({ min: 1 }),

        // Validate totalAmount as a number greater than 0
        body('totalAmount').isFloat({ gt: 0 }),

        // Validate prioAmount as a number greater than 0 if priority is 1
        body('prioAmount').custom((value, { req }) => {
            if (req.body.priority === 1) {
                if (!value || isNaN(value) || value <= 0) {
                    throw new Error('prioAmount must be a number greater than 0 when priority is 1');
                }
            }
            return true;
        }),
    ],
    (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


    const { userId, customerName, status, priority, deliveryTime, totalAmount, prioAmount, cartContent } = req.body;
    const formattedDeliveryTime = dayjs(deliveryTime).format('YYYY-MM-DD HH:mm:ss');


    const addOrderQuery = `
        INSERT INTO Zamowienie (userId, imie, status, priorytet, przewidywanaDostawa, cenaRazem, cenaPriorytetu)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(addOrderQuery, [userId, customerName, status, priority, formattedDeliveryTime, totalAmount, priority ? prioAmount : 0], (addOrderErr, result) => {
        if (addOrderErr) {
            console.error("Error adding order:", addOrderErr);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            const orderId = result.insertId;


            const addOrderedItemsQuery = `
                INSERT INTO ZamowionePrzedmioty (orderId, pizzaId, nazwa, ilosc, cenaSzt, razem)
                VALUES (?, ?, ?, ?, ?, ?)
            `;


            for (const item of cartContent) {
                const orderedItemsValues = [orderId, item.pizzaId, item.name, item.quantity, item.total / item.quantity, item.total];

                connection.query(addOrderedItemsQuery, orderedItemsValues, (addItemsErr) => {
                    if (addItemsErr) {
                        console.error("Error adding ordered items:", addItemsErr);
                        res.status(500).json({ error: "Internal Server Error" });
                    }

                    res.status(200).json({ message: "Order added successfully" });
                });
            }
        }
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

app.get('/getAll/Zamowienia/:id', (req, res) => {
    const userId = req.params.id;
    const query = `
    SELECT Zamowienie.id AS orderId, Zamowienie.imie AS klient, Zamowienie.status, Zamowienie.przewidywanaDostawa,
           ZamowionePrzedmioty.id AS orderedItemId, ZamowionePrzedmioty.nazwa AS pizzaName, ZamowionePrzedmioty.ilosc,
           ZamowionePrzedmioty.cenaSzt, ZamowionePrzedmioty.razem
    FROM Zamowienie
    JOIN ZamowionePrzedmioty ON Zamowienie.id = ZamowionePrzedmioty.orderId
    WHERE userId = ?`;

    connection.query(query, [userId], (err, rows) => {
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

app.put('/updatePizza/:id', [
    // Validate pizzaId as integer
    body('id').isInt(),

    // Validate nazwa as string
    body('nazwa').isString(),

    // Validate cena as a number greater than 0
    body('cena').isFloat({ gt: 0 }),

    // Validate img as string
    body('img').isString(),

    // Validate dostepne as boolean
    body('dostepne').isBoolean(),
],
    (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

app.put('/updatePizzaIngredients/:id',
    [
    // Validate pizzaId as integer
    body('id').isInt(),

    // Validate ingredients as an array with at least one element
    body('ingredients').isArray({ min: 1 }),
],
    (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

app.post('/addPizza',
    [
    // Validate nazwa as string
    body('nazwa').isString(),

    // Validate cena as a number greater than 0
    body('cena').isFloat({ gt: 0 }),

    // Validate img as string
    body('img').isString(),

    // Validate dostepne as boolean
    body('dostepne').isBoolean(),

    // Validate skladniki as an optional array with at least one element
    body('skladniki').optional().isArray({ min: 1 }),
],
    (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { nazwa, cena, img, dostepne, skladniki } = req.body;


    connection.query('SELECT MAX(id) AS maxId FROM Pizza', (maxIdErr, maxIdResult) => {
        if (maxIdErr) {
            console.error("Error getting max id:", maxIdErr);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }


        const newPizzaId = maxIdResult[0].maxId + 1;


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

app.delete('/deletePizza/:id',
    [
    // Validate pizzaId as integer
    param('id').isInt(),
],
    (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const pizzaId = req.params.id;


    const deletePizzaIngredientsQuery = `
        DELETE FROM PizzaSkladniki
        WHERE pizzaId = ?
    `;

    connection.query(deletePizzaIngredientsQuery, [pizzaId], (deleteIngredientsErr) => {
        if (deleteIngredientsErr) {
            console.error("Error deleting pizza ingredients:", deleteIngredientsErr);
            res.status(500).json({ error: "Internal Server Error" });
        } else {

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



app.post("/register",
    [
    // Validate username as string
    body('username').isString(),

    // Validate password as string with a minimum length of 6 characters
    body('password').isString().isLength({ min: 6 }),
],
    (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const givenUsername = req.body.username;
    const givenPassword = req.body.password;

    bcrypt.hash(givenPassword, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }

        connection.query(
            "INSERT INTO user (username, password, rola) VALUES (?,?, 'User')",
            [givenUsername, hash],
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: "Internal Server Error" });
                    return;
                }
                res.status(200).json({ message: "User registered successfully" });
            }
        );
    });
});

app.post("/login",
    [
    // Validate username as string
    body('username').isString(),

    // Validate password as string with a minimum length of 6 characters
    body('password').isString()/*.isLength({ min: 6 })*/,
],
    (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const givenUsername = req.body.username;
    const givenPassword = req.body.password;

    connection.query(
        "SELECT * FROM user WHERE username = ?",
        [givenUsername],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Internal Server Error" });
                return;
            }

            if (result.length > 0) {
                bcrypt.compare(givenPassword, result[0].password, (error, response) => {
                    if (response) {
                        req.session.user = result;
                        res.status(200).json(result);
                    } else {
                        res.status(401).json({ message: "Incorrect credentials" });
                    }
                });
            } else {
                res.status(404).json({ message: "User not found" });
            }
        }
    );
});


app.get("/login",
    (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
});


app.put('/updateOrderStatus/:id',
    [
    // Validate orderId as integer
    param('id').isInt(),
],
    (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const orderId = req.params.id;

    const updateOrderStatusQuery = `
        UPDATE Zamowienie
        SET status = 0
        WHERE id = ?
    `;

    connection.query(updateOrderStatusQuery, [orderId], (err, result) => {
        if (err) {
            console.error("Error updating order status:", err);
            res.status(500).json({ error: "Internal Server Error" });
        } else {
            res.status(200).json({ message: "Order status updated successfully" });
        }
    });
});


app.delete('/deleteOrder/:id',
    [
    // Validate orderId as integer
    param('id').isInt(),
],
    (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const orderId = req.params.id;


    const deleteOrderedItemsQuery = `
        DELETE FROM ZamowionePrzedmioty
        WHERE orderId = ?
    `;

    connection.query(deleteOrderedItemsQuery, [orderId], (deleteItemsErr) => {
        if (deleteItemsErr) {
            console.error("Error deleting ordered items:", deleteItemsErr);
            res.status(500).json({ error: "Internal Server Error" });
        } else {


            const deleteOrderQuery = `
                DELETE FROM Zamowienie
                WHERE id = ?
            `;

            connection.query(deleteOrderQuery, [orderId], (deleteOrderErr) => {
                if (deleteOrderErr) {
                    console.error("Error deleting order:", deleteOrderErr);
                    res.status(500).json({ error: "Internal Server Error" });
                } else {
                    res.status(200).json({ message: "Order and associated items deleted successfully" });
                }
            });
        }
    });
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
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

