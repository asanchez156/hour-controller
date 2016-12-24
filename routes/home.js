var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { title: 'Pantalla principal',
  						page: 'Pantalla principal',
  						page: 'home' });
});

module.exports = router;
