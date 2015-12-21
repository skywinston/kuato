require('dotenv').load();
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var authenticate = require('../../lib/authenticate');
var pg = require('pg');
var conString = process.env.DB_URI;
var bcrypt = require('bcrypt');
var expressJwt = require('express-jwt');

// Set up express jwt middleware to sign the token with the server-side secret
router.use(expressJwt({ secret: process.env.JWT_SECRET }).unless({ path: ['/login', '/register', '/favicon.ico'] }));

router.post('/login', authenticate, function(req, res){

    // Authentication passed!
    var token = jwt.sign({
        username: req.body.email
    }, process.env.JWT_SECRET);
    res.send({
        token: token,
        user: req.body.email
    });

});

router.post('/register', function(req, res){
    console.log(req.body);
    // Create a hash and set cost of encryption
    var hash = bcrypt.hashSync(req.body.password, 8);

    pg.connect(conString, function(err, client, done){
        client.query('SELECT * FROM users WHERE email=$1', [req.body.email], function(err, user){
            if(user.rows.length === 0){
                client.query('INSERT INTO users VALUES (default, $1, $2)', [req.body.email, hash], function(err, user){
                    done();
                    var token = jwt.sign({
                        username: req.body.email
                    }, process.env.JWT_SECRET);
                    res.send({
                        token: token,
                        user: req.body.email
                    });
                });
            } else {
                return res.status(409).end("User already exists!")
            }
        });
    });
});

module.exports = router;