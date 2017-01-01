// controllers/hourController.js

var models = require("../models/models.js")

exports.index = function(req, res, next) {
	res.render('hour', {
	    	title: 'Jornadas',
			parentPage : 'Pantalla principal',
			page: 'hour',
  			user: req.session.user
	    });
}

exports.create = function(req, res, next) {
   console.log("Create Workingday");
   /*
  var search = ("%" + (req.query.search || "") + "%").replace(' ', '%');
  	models.Workingday.findAll().then(function(quizes) {
	    res.render('hour', {
	    	title: 'Jornadas',
			parentPage : 'Pantalla principal',
			page: 'hour'
	      	// devuelve una lista ordenada si se ha realizado una busqueda
	      	hours: (req.query.search) ? quizes.sort(function(a, b) {
	        	return a.pregunta > b.pregunta;
	      	}) : quizes,
	      errors: [],
	    })
  }).catch(function(error) {
    next(error);
  });*/
}

exports.find = function(req, res, next) {
   console.log("Find workingday");
}