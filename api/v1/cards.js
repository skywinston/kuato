var express = require('express');
var router = express.Router();
var knex = require('../../db/knex');
var jwt = require('jsonwebtoken');


router.get('/', function (req, res) {
    // there is not scenario yet where we'll need to get all cards...
});


router.get('/:id', function (req, res) {
    // TODO — protect this route by ensuring the card resource belongs to the user
    var userId = jwt.decode(req.get("Authorization").split(" ")[1]).id;
    return knex('cards')
        .where('id', '=', req.params.id)
        .limit(1)
        .then(function (card) {
            res.json(card[0]);
        });
});

router.post('/', function (req, res) {
    console.log("Req received at POST to cards");
    return knex('cards')
        .insert({
            deck_id: req.body.deck_id,
            question: req.body.question,
            answer: req.body.answer,
            rating: req.body.rating,
            studied: req.body.studied
        }, "*")
        .then(function (response) {
            res.json(response[0]);
        });
});


router.post('/update/:id', function (req, res) {
    console.log(req.body);
    console.log("PATCH to cards!");

    // TODO - Why am I getting an internal err 500 on this route? Sending from CardFactory.update
    return knex('cards')
        .where('id', req.body.id)
        .update({
            id: req.body.id,
            deck_id: req.body.deck_id,
            question: req.body.question,
            answer: req.body.answer,
            rating: req.body.rating
        })
        .returning('*')
        .then(function (updatedCard) {
            res.json(updatedCard[0]);
        })
        .catch(function (error) {
            if (error) {
                throw new Error(error);
            }
        });
});



module.exports = router;


