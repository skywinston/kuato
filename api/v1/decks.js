var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = process.env.DB_URI;
var jwt = require('jsonwebtoken');

router.get('/', function (req, res) {
    var userId = jwt.decode(req.get("Authorization").split(" ")[1]).id;
    pg.connect(conString, function (err, client, done) {
       client.query('SELECT * FROM decks WHERE owner=$1', [userId], function (err, response) {
           // todo — userId reads 1 and there is def deck record with an owner of 1, so why no response?
           //if (err) throw new Error ("Error finding owner with id of " + userId + ":", err);
           console.log("Response from DB: ", response); // expect to see record from db matching email of skywinston@gmail.com
           done();
       });
    });
    console.log('Req received in GET to /decks');
});

module.exports = router;