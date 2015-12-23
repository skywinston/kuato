var expect = require('chai').expect;
var app = require('../server');
var request = require('supertest')(app);
var knex = require('../db/knex');
var demoPassword = "$2a$08$Saidu4Z5VkIdChZg78xqJOzuW.HwEaSGbmGy3C4HiKlSsMK1z3.sy";

describe('Register', function () {

    context("when the user does not already exist", function(){
        beforeEach( function () {
            return knex('users').del()
        });

        it('creates a new user', function (done) {
            request.post('/register')
                .send( {email: 'demo@kuato.com', password: "password" } )
                .expect(200)
                .end( function (err, res) {
                    if (err) return done(err);
                    expect(res.body.token).to.exist;
                    expect(res.body.user).to.eq('demo@kuato.com');
                    done();
                })
        })
    })

    context("when the user already exists", function(){
        beforeEach( function () {
            return knex('users').del()
                .then( function () {
                    return knex('users').insert({email: 'demo@kuato.com', passworddigest: demoPassword})
                });
        });

        it('Creates a new user if a user with the provided email does not already exist', function (done) {
            request.post('/register')
                .send( {email: 'demo@kuato.com', password: "password" } )
                .expect(409, done)
        })
    })

});

describe('Login', function () {

    beforeEach( function () {
        return knex('users').del()
            .then( function () {
                return knex('users').insert({email: 'demo@kuato.com', passworddigest: demoPassword})
            });
    });

    it('logs the user in when passed valid credentials', function (done) {
        request.post('/login')
            .send( {email: 'demo@kuato.com', password: "cool" } )
            .expect(200)
            .end( function (err, res) {
                if (err) return done(err);
                expect(res.body.token).to.exist;
                expect(res.body.user).to.eq('demo@kuato.com');
                done();
            })
    });

    it('does not log the user in when passed invalid credentials', function (done) {
        request.post('/login')
            .send( {email: 'demo@kuato.com', password: "uncool" } )
            .expect(401, done)
    });

});