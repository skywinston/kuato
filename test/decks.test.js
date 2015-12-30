var expect = require('chai').expect;
var app = require('../server');
var request = require('supertest')(app);
var knex = require('../db/knex');
var token = process.env.JWT_SECRET;

describe('Decks', function () {
    var userId;

    context('when the user views the dashboard', function () {
        beforeEach( function () {
            return knex('decks').del()
            .then(function(){
                return knex('users').del()
            })
            .then(function(){
                return knex('users').insert( {email: 'demo@kuato.com', passworddigest: "$2a$08$Saidu4Z5VkIdChZg78xqJOzuW.HwEaSGbmGy3C4HiKlSsMK1z3.sy" } )
                    .returning('id');
            })
            .then(function(user){
                console.log("User from insert: ", user);
                userId = user.id;
            })
            .then(function(){
                knex('decks').insert({
                    owner: userId,
                    title: 'JavaScript'
                }, {
                    owner: userId,
                    title: 'AngularJS'
                }, {
                    owner: userId,
                    title: 'Express'
                })
            })
        })

        it('returns all of the decks associated with the active user', function (done) {

            request.get('/decks')
            // todo — The token is more than just the jwt secret.  How do we mock this up to get the right user Id sent?
                .set('Authorization', 'Bearer ' + token + '');
                .expect(200)
                .end( function (err, res) {
                    console.log(res.body); // expect to see three deck objects
                    done();
                })

        })

    })
});