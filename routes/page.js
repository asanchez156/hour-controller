var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('page', { title: 'Page',
  						parentPage : 'Pantalla principal',
  						page: 'page' });
});

module.exports = router;
