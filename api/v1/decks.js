var express = require('express');
var router = express.Router();
var knex = require('../../db/knex');
var pg = require('pg');
var jwt = require('jsonwebtoken');

router.get('/', function (req, res) {
    //console.log("get to /");
    var userId = jwt.decode(req.get("Authorization").split(" ")[1]).id;
    
    return knex.raw(
                    "select * from decks INNER JOIN cards on (decks.id = deck_id) where owner = " + userId  +
                    "UNION " +
                    "select * from decks left outer join cards on (decks.id = deck_id) where (deck_id IS NULL AND decks.owner = 1);"
        ).then(function (result) {
            var decks = result.rows;

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

                // If there is a deck with no ratings (and therefore no cards) return null so the ratings object is empty;
                if (deck.rating === null) return;

                // Otherwise, accumulate each instance of each rating into the ratings object.
                target.ratings[deck.rating] = (target.ratings[deck.rating] || 0) + 1;
            });

            var result = [];

            for (var rating in indexed) {
                result.push(indexed[rating]);
            }

            res.json(result);
    });

});

router.get('/:id', function (req, res) {
    //console.log("get to /:id");
    // TODO - How do I protect this route by ensuring the cards served up belongs to the user?
    var userId = jwt.decode(req.get("Authorization").split(" ")[1]).id;

    return knex('cards')
        .where('deck_id', '=', req.params.id)
        .then(function (cards) {
            res.json(cards);
        });
});

router.get('/deck/:id', function (req, res) {
    //console.log("get to deck/:id");
   return knex('decks')
        .where('id', '=', req.params.id)
        .then( function (result) {
            console.log(result);
            res.json(result[0]);
        });
});

router.post('/', function (req, res) {
    //console.log("Post to /decks");
    var userId = jwt.decode(req.get("Authorization").split(" ")[1]).id;

    // TODO - What if deck title already exists?  Look for error code sent back from db and catch it.
    return knex('decks')
        .insert({owner: userId, title: req.body.title})
        .returning('*')
        .then(function (result) {
            result[0].ratings = null;
            res.json(result[0]);
        });
});

module.exports = router;