var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('about', { title: 'Saber más',
  						parentPage : 'Pantalla principal',
  						page: 'about' });
});

module.exports = router;
