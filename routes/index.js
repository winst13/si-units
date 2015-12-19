var express = require('express');
var router = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Unit Coverter' });
});

router.get(/ap*/, function(req, res) {
  res.json('request: ' + req.url);
});

module.exports = router;
