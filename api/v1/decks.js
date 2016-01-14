var express = require('express');
var router = express.Router();
var knex = require('../../db/knex');
var pg = require('pg');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var shuffle = require('../../lib/shuffle');

router.get('/', function (req, res) {
    //console.log("get to /");
    var userId = jwt.decode(req.get("Authorization").split(" ")[1]).id;
    var index = {};

    return knex('decks')
        .where('owner', '=', userId)
        .then(function (decks) {

            // Populate the index object and prepare promises which fetch all cards for each deck.
            var promises = [];

            decks.forEach( function (deck) {

                // Convert the last studied timestamp into human-readable format with moment.js
                deck.studied = moment(deck.studied).format("MMMM Do YYYY");

                // Initialize cards array and ratings counter
                deck.cards = [];
                deck.ratings = {
                    "1": 0,
                    "2": 0,
                    "3": 0,
                    "new": 0
                };
                index[deck.id] = deck;
                promises.push(knex('cards').where('deck_id', '=', deck.id));
            });

            return Promise.all(promises);

        })
        .then(function (decksOfCards) {

            // Collapse the cards results into their matching decks in the index object
            decksOfCards.forEach( function (deck) {
                // If the deck has no cards, skip it
                if (!deck.length) return;


                // Bind each array of cards to their deck in the index object
                index[deck[0].deck_id].cards = deck;

                // Accumulate occurances of ratings into each decks' ratings object
                deck.forEach( function (card) {
                    switch (card.rating) {
                        case 1:
                            index[deck[0].deck_id].ratings["1"]++;
                            break;
                        case 2:
                            index[deck[0].deck_id].ratings["2"]++;
                            break;
                        case 3:
                            index[deck[0].deck_id].ratings["3"]++;
                            break;
                        case 0:
                            index[deck[0].deck_id].ratings["new"]++;
                    }
                });
            });

            //console.log("Index after card inclusion");
            //console.log(index);

            // Send the index object to the client
            res.json(index);
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


router.post('/study', function (req, res) {
    var promises = req.body.decks.map(function(deckId){
        return knex('cards').where('deck_id', '=', deckId);
    });
    return Promise.all(promises)
        .then(function(results){
            // This gives us an array with sub-arrays with cards matched by deck_id

            // We flatten this into a single array to prep for shuffling
            var output = results.reduce( function (flatArr, nestedArr) {
                flatArr = flatArr.concat(nestedArr);
                return flatArr;
            }, []);

            var output = shuffle(output);

            res.json(output);
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


router.post('/update/:id', function (req, res) {
    console.log("POST request received at /update/:id");

    return knex('decks')
        .where('id', req.params.id)
        .update({
            studied: req.body.studied
        }, "*")
        .then(function (updates) {
            res.json(updates);
        });

});

module.exports = router;