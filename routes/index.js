var express = require('express');
var router = express.Router();

//var workingDayController = require('../controllers/workingdayController');
var sessionController = require('../controllers/sessionController');
var hourController = require('../controllers/hourController');
var paleController = require('../controllers/paleController');
var employeeController = require('../controllers/employeeController');
var companyController = require('../controllers/companyController');
var statisticsController = require('../controllers/statisticsController');
var importExportController = require('../controllers/importExportController');

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
router.post('/hour/find', sessionController.loginRequired, hourController.find);
router.post('/hour/create', sessionController.loginRequired, hourController.create);
router.post('/hour/create/batch', sessionController.loginRequired, hourController.createBatch);
router.post('/hour/update', sessionController.loginRequired, hourController.update);
router.post('/hour/delete', sessionController.loginRequired,  hourController.delete);

/* Employeee */
router.get('/employee/find', sessionController.loginRequired, employeeController.find);

/* Company */
router.get('/company/find', sessionController.loginRequired, companyController.find);

/* Pales */
router.get('/pale', sessionController.loginRequired, sessionController.messages, paleController.index);
router.post('/pale/find', sessionController.loginRequired, paleController.find);
router.post('/pale/create', sessionController.loginRequired, paleController.create);
router.post('/pale/update', sessionController.loginRequired, paleController.update);
router.post('/pale/delete', sessionController.loginRequired, paleController.delete);

/* Statistics */
router.get('/statistics', sessionController.loginRequired, sessionController.messages, statisticsController.index);
router.post('/statistics/find/pale', sessionController.loginRequired, statisticsController.findPale);
router.post('/statistics/find/workingday', sessionController.loginRequired, statisticsController.findWorkingday);


/* Excel import export Working Day */
router.post('/excel/import/workingday', sessionController.loginRequired, importExportController.importWorkingDay);
router.get('/excel/import/workingday', sessionController.loginRequired, importExportController.importWorkingDay);
router.post('/excel/export/workingday', sessionController.loginRequired, importExportController.exportWorkingDay);
router.get('/excel/export/workingday', sessionController.loginRequired, importExportController.exportWorkingDay);

/* Excel import export Pale */
router.post('/excel/import/pale', sessionController.loginRequired, importExportController.importPale);
router.get('/excel/import/pale', sessionController.loginRequired, importExportController.importPale);
router.post('/excel/export/pale', sessionController.loginRequired, importExportController.exportPale);
router.get('/excel/export/pale', sessionController.loginRequired, importExportController.importPale);


module.exports = router;
