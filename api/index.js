var express = require('express');
var router = express.Router();
var decks = require('./decks');

router.use('./decks', decks);

module.exports = router;