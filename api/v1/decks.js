var express = require('express');
var router = express.Router();
var knex = require('../../db/knex');
var pg = require('pg');
var jwt = require('jsonwebtoken');

module.exports = router;

router.get('/', function (req, res) {
    var userId = jwt.decode(req.get("Authorization").split(" ")[1]).id;

    return knex('decks')
        .where('owner', '=', userId)
        .innerJoin('cards', 'decks.id', 'deck_id')
        .columns('deck_id', 'title', 'studied', 'rating')
        .then(function (decks) {
            var indexed = decks.map(function (deck) {
                return {
                    id: deck.deck_id,
                    title: deck.title,
                    studied: deck.studied,
                    ratings: {}
                }
            })
            .reduce(function (prev, item) {
                prev[item.id] = item;
                return prev;
            }, {});

            decks.forEach(function (deck) {
                var target = indexed[deck.deck_id];
                target.ratings[deck.rating] = (target.ratings[deck.rating] || 0) + 1;
            });

            var result = [];

            for (var rating in indexed) {
                result.push(indexed[rating]);
            }

            res.json(result);

        });

});

