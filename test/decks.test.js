var expect = require('chai').expect;
var app = require('../server');
var request = require('supertest')(app);
var knex = require('../db/knex');