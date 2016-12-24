var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('login', { title: 'Iniciar sesión',
  						parentPage : 'Pantalla principal',
  						page: 'login' });
});

module.exports = router;
