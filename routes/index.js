var express = require('express');
var router = express.Router();

//var workingDayController = require('../controllers/workingdayController');
var sessionController = require('../controllers/sessionController');
var hourController = require('../controllers/hourController');

var params = function (title, parentPage, page, user, status) { 
    return {
              title: title,
              parentPage : parentPage,
              page: page ,
              user: user,
              status: status
    }
}

/* GET home page. */
router.get('/', function(req, res) {
    res.render('home', { title: 'Pantalla principal',
  						page: 'home' ,
  						user: req.session.user });
});

/* GET Login. */
router.get('/login', function(req, res) {
    res.render('login', params('Iniciar sesión','Pantalla principal','login', req.session.user, undefined));
});

/* GET Login error. */
router.get('/login/error', function(req, res) {
    res.render('login', params('Iniciar sesión','Pantalla principal','login', req.session.user, {error : req.session.error, success : undefined}));
});

/* GET Page page. */
router.get('/page', function(req, res) {
  res.render('page', params('Página','Pantalla principal','page', req.session.user, undefined));
});

/* GET about page. */
router.get('/about', function(req, res) {
  res.render('about', params('Saber más','Pantalla principal','about', req.session.user, undefined));
});

/* Authentication */
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

/* Hour */

router.get('/hour', sessionController.loginRequired, hourController.index);
router.post('/hour', sessionController.loginRequired, hourController.find);
router.post('/hour/create', sessionController.loginRequired, hourController.create);
router.get('/hour/error', function(req, res) {
    res.render('hour', params('Jornada','Pantalla principal','hour', req.session.user, req.session.error, {error : req.session.error, success : {}}));
});

router.get('/*', function(req, res) {
	res.redirect("/");
});

module.exports = router;