var express = require('express');
var router = express.Router();

//var workingDayController = require('../controllers/workingdayController');
var sessionController = require('../controllers/sessionController');
var hourController = require('../controllers/hourController');

var params = function (title, parentPage, page, user, messages) { 
    return {
              title: title,
              parentPage : parentPage,
              page: page ,
              user: user,
              messages: messages
    }
}

/* GET home page. */
router.get('/', sessionController.messages, function(req, res) {
    res.render('home', { title: 'Pantalla principal',
  						page: 'home' ,
  						user: req.session.user,
              messages: req.session.messages,
              login : 0});
});

/* GET Login. */
router.get('/login', sessionController.messages, function(req, res) {
    if(req.session.user!=undefined){
        res.redirect("/");
    }else{
      res.render('home', { title: 'Pantalla principal',
                page: 'home' ,
                user: req.session.user,
                messages: req.session.messages,
                login: 1});
    }
});

/* Authentication */
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);

/* GET Page page. */
router.get('/page', sessionController.loginRequired, sessionController.messages, function(req, res) {
  res.render('page', params('Página','Pantalla principal','page', req.session.user, req.session.messages));
});

/* GET about page. */
router.get('/about', sessionController.messages, function(req, res) {
  res.render('about', params('Saber más','Pantalla principal','about', req.session.user, req.session.messages));
});

/* Hour */
router.get('/hour', sessionController.loginRequired, sessionController.messages, hourController.index);
router.post('/hour/find', sessionController.loginRequired, sessionController.messages, hourController.find);
router.post('/hour/create', sessionController.loginRequired, sessionController.messages, hourController.create);
router.post('/hour/update', sessionController.loginRequired, sessionController.messages, hourController.update);
router.post('/hour/remove', sessionController.loginRequired, sessionController.messages, hourController.remove);

module.exports = router;