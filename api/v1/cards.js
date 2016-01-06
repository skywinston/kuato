var express = require('express');
var router = express.Router();
var knex = require('../../db/knex');
var jwt = require('jsonwebtoken');


router.get('/', function (req, res) {

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


module.exports = router;


