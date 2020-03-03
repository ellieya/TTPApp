const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const mysql = require('mysql2/promise');
const info = require('./info');

//mySQL configs
const pool = mysql.createPool({
    host: info.gcpCredentials.host,
    user: info.gcpCredentials.user,
    password: info.gcpCredentials.password,
    database: info.gcpCredentials.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

//Express configs
const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("success");
})

app.post('/login', async (req, res) => {
    try {
        let [rows, fields] = await pool.execute(
            'SELECT `name`, email, cash FROM users WHERE email = ? AND password = ?;',
            [req.body["E-mail"], req.body["Password"]]);

        if (rows.length == 0) {
            res.json(info.err("Incorrect credentials."));
        } else {
            res.json(info.okAppend({ "username": rows[0].name, "email": rows[0].email })); //E-mail is used as "id"
        }
    } catch (err) {
        res.json(info.err("An exception was caught."));
    }

})

app.post('/register', async (req, res) => {
    try {
        let [rows, fields] = await pool.execute(
            'SELECT email FROM users WHERE email = ?;',
            [req.body["E-mail"]]);

        if (rows.length == 0) {
            [rows, fields] = (await pool.execute(
                'INSERT INTO users (`name`, email, `password`) ' +
                'VALUE (?, ?, ?)',
                [req.body["Name"], req.body["E-mail"], req.body["Password"]]
            ))

            res.json(info.okAppend({ "username": req.body["Name"], "email": req.body["E-mail"] })); //E-mail is used as "id"
            console.log("Add successful.");
        } else {
            console.log("E-mail already in system!");
            res.json(info.err("E-mail already in system!"));
        }
    } catch (err) {
        res.json(info.err("An exception was caught."));
        console.log(err);
    }
})

app.post('/buy', async (req, res) => {
    /**
     * Expectations from object being sent:
     * price: "293.44"
     * stock: "AAPL"
     * qty: "9"
     * cost: 2640.96
     * user: "ellieya@gmail.com"
     */
    let [rows, fields] = await pool.execute(
        'SELECT cash FROM users WHERE email = ?;',
        [req.body["user"]]);

    //Get the user's current balance
    let currentBalance = rows[0].cash;
    let newBalance = currentBalance - req.body.cost;
    //If user's current balance - cost < 0, return error
    if (newBalance < 0) {
        res.json(info.err("Funds are insufficient. Require $" + Math.abs(newBalance).toFixed(2) + " more to complete transaction."))
    } else {
        //Place into transactions
        [rows, fields] = await pool.execute(
            'INSERT INTO transactions(userID, stock, pricePerStock, totalCost, qty, `type`) VALUE ( ?, ?, ?, ?, ?, "BUY");',
            [req.body["user"], req.body["stock"], Number.parseFloat(req.body["price"]), Number.parseFloat(req.body["cost"]), req.body["qty"]]
        );

        //Update ownership
        //Do they already have it?
        [rows, fields] = await pool.execute(
            'SELECT qty FROM ownership ' +
            'WHERE userID = ? AND stock = ?;',
            [req.body["user"], req.body["stock"]]
        )


        //Update value
        if (rows.length > 0) {
            let currentQty = rows[0].qty;
            [rows, fields] = await pool.execute(
                'UPDATE ownership SET qty = ? WHERE userID = ? AND stock = ?;',
                [Number.parseInt(req.body["qty"]) + Number.parseInt(currentQty), req.body["user"], req.body["stock"]]
            )
        }
        //Otherwise, create new entry
        else {
            [rows, fields] = await pool.execute(
                'INSERT INTO ownership ' +
                'VALUE (?, ?, ?)', //userID, stock, qty
                [req.body["user"], req.body["stock"], req.body["qty"]]
            )
        }

        //Update user's balance in database
        [rows, fields] = await pool.execute(
            'UPDATE users SET cash = ? WHERE email = ?;',
            [newBalance, req.body["user"]]
        )
        res.json(info.ok());
    }

})

//The following should require authentication, implement if we have time
app.post('/getAllStock', async (req, res) => {
    console.log(req.body);
    let [rows, fields] = await pool.execute(
        "SELECT * FROM ownership WHERE userID = ?",
        [req.body["user"]]
    )

    res.json(rows);
})

app.post('/getAllTransaction', async (req, res) => {
    let [rows, fields] = await pool.execute(
        "SELECT * FROM transactions WHERE userID = ? ORDER BY `timestamp` DESC",
        [req.body["user"]]
    )

    res.json(rows);
})

app.post('/getCash', async (req, res) => {
    let [rows, fields] = await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [req.body["user"]]
    )

    res.json(rows[0].cash);
})

app.listen(port, () => console.log(`Listening, PORT: ${port}`))