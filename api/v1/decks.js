var express = require('express');
var router = express.Router();
var knex = require('../../db/knex');
var pg = require('pg');
var conString = process.env.DB_URI;
var jwt = require('jsonwebtoken');

router.get('/', function (req, res) {
    var userId = jwt.decode(req.get("Authorization").split(" ")[1]).id;
    knex('decks')
        .where('owner', '=', userId)
        .then(function (decks){
            res.json(decks);
        })
});

module.exports = router;