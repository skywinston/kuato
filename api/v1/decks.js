var express = require('express');
var router = express.Router();
var knex = require('../../db/knex');
var pg = require('pg');
var conString = process.env.DB_URI;
var jwt = require('jsonwebtoken');

module.exports = router;

router.get('/', function (req, res) {
    var userId = jwt.decode(req.get("Authorization").split(" ")[1]).id;

    return knex('decks')
        .where('owner', '=', userId)
        .innerJoin('cards', 'decks.id', 'deck_id')
        .columns('deck_id', 'title', 'studied', 'rating')
        .then(function (decks) {
            console.log(decks);
        });
});

