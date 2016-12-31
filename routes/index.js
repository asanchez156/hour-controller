var express = require('express');
var router = express.Router();

//var workingDayController = require('../controllers/workingdayController');
var sessionController = require('../controllers/sessionController');
var hourController = require('../controllers/hourController');

/* GET home page. */
router.get('/', function(req, res) {
	console.log(req.session.user);
    res.render('home', { title: 'Pantalla principal',
  						page: 'Pantalla principal',
  						page: 'home' ,
  						user: req.session.user });
});

/* GET Login. */
router.get('/login', function(req, res) {
    res.render('login', { title: 'Iniciar sesión',
  						parentPage : 'Pantalla principal',
  						page: 'login' ,
  						user: req.session.user });
});

/* GET Page page. */
router.get('/page', function(req, res) {
  res.render('page', { title: 'Page',
  						parentPage : 'Pantalla principal',
  						page: 'page' ,
  						user: req.session.user });
});

/* GET about page. */
router.get('/about', function(req, res) {
  res.render('about', { title: 'Saber más',
  						parentPage : 'Pantalla principal',
  						page: 'about' ,
  						user: req.session.user });
});

/* Authentication */
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

/* Hour */

router.get('/hour', sessionController.loginRequired, hourController.index);
router.post('/hour/create', sessionController.loginRequired, hourController.create);

router.get('/*', function(req, res) {
	res.redirect("/");
});

module.exports = router;