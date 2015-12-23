require('dotenv').load();
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var authenticate = require('../../lib/authenticate');
var pg = require('pg');
var knex = require('../../db/knex.js');
var conString = process.env.DB_URI;
var bcrypt = require('bcrypt');
var expressJwt = require('express-jwt');

// Set up express jwt middleware to sign the token with the server-side secret
router.use(expressJwt({ secret: process.env.JWT_SECRET }).unless({ path: ['/login', '/register', '/favicon.ico'] }));

router.post('/login', authenticate, function(req, res){

    // Authentication passed!
    var token = jwt.sign({
        username: req.body.email,
        id: req.userId
    }, process.env.JWT_SECRET);
    res.send({
        token: token,
        user: req.body.email
    });

});

router.post('/register', function(req, res){
    // Create a hash and set cost of encryption
    var hash = bcrypt.hashSync(req.body.password, 8);

    knex('users').where('email', '=', req.body.email).then(function(users){
        console.log(users);
        if (users.length === 0) {
            knex('users').insert({email: req.body.email, passworddigest: hash})
                .returning('*')
                .then( function (user) {

                    var token = jwt.sign({
                        username: user[0].email,
                        id: user[0].id
                    }, process.env.JWT_SECRET);

                    res.json({
                        token: token,
                        user: user[0].email
                    });

                });
        } else {
            return res.status(409).end("User already exists!");
        }
    });
});

module.exports = router;
