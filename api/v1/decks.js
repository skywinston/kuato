var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = process.env.DB_URI;

router.get('/', function (req, res) {
    pg.connect(conString, function (err, client, done) {
       client.query('SELECT * from decks WHERE owner = $1', [req.body.email], function (err, user) {

       })
    });
    console.log('Req received in GET to /decks');
});

module.exports = router;