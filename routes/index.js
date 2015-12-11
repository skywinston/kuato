var express = require('express');
var router = express.Router();

router.get('*', function(req, res) {
  res.sendFile('index.html', {root: __dirname + "/../app/"}, function (err) {
    if (err) throw new Error("Error in wildcard route sending file.");
  });
});

module.exports = router;
