const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());

const db = mysql.createConnection({
    host: '172.31.40.8',
    user: 'paytmuser',
    password: 'paytmpass',
    database: 'paytm'
});

db.connect((err) => {

    if(err){
        console.log('Database connection failed');
    } else {
        console.log('MySQL Connected');
    }

});

app.get('/api/users', (req, res) => {

    const sql = 'SELECT * FROM users';

    db.query(sql, (err, result) => {

        if(err){
            res.status(500).send(err);
        } else {
            res.json(result);
        }

    });

});

app.listen(5000, () => {
    console.log('Backend running on port 5000');
});