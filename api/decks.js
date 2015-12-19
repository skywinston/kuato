var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = process.env.DB_URI;

// todo — figure out why this route is still throwing a 304... its route not be wired up to the server correctly

router.get('/', function (req, res) {
    console.log('Req received in GET to /decks');
});

module.exports = router;