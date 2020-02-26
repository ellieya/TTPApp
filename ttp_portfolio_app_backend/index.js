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
            'SELECT `name` FROM users WHERE email = ? AND password = ?;',
            [req.body["E-mail"], req.body["Password"]]);
        
        if (rows.length == 0) {
            res.json(info.err("Incorrect credentials."));
        } else {
            res.json(info.okAppend({"username": rows[0].name}));
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
            res.json(info.okAppend({"username": req.body["Name"]}));
            console.log("Add successful.");
        } else {
            console.log("E-mail already in system!");
            res.json(info.err("E-mail already in system!"));
        }
    } catch (err) {
        res.json(info.err("An exception was caught."));
    }
})

app.post('/buy', async (req, res) => {
    //expect ticker
})

app.listen(port, () => console.log(`Listening, PORT: ${port}`))