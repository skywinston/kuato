var pg = require('pg');
var bcrypt = require('bcrypt');
var knex = require('../db/knex');

function authenticate(req, res, next){
    var body = req.body;

    // Check to see if they username and password were provided...
    if(!body.email || !body.password){
        return res.status(400).end("Must provide username or password");
    }

    knex('users')
        .where('email', '=', req.body.email)
        .then( function (user) {
            if(!bcrypt.compareSync(req.body.password, user[0].passworddigest)){
                // if it doesn't...
                return res.status(401).end("Username or password incorrect");
            }
            // if it does...
            req.userId = user[0].id;
            next();
        });

}

module.exports = authenticate;
