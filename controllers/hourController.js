// controllers/hourController.js

var models = require("../models/models.js")

exports.index = function(req, res, next) {
	res.render('hour', {
	    	title: 'Jornadas',
			parentPage : 'Pantalla principal',
			page: 'hour',
  			user: req.session.user,
  			status : {error : {}, success:{}}
	    });
}

exports.create = function(req, res, next) {
	console.log(req.body);
   	if (req.body.pales != undefined || req.body.paleDate!=undefined){
	   	var pale = models.Pale.build({
	   		companyId : 1,
	   		userId: req.session.user.id,
	   		paleNum: req.body.pales,
	   		date: req.body.paleDate,
	   		description : req.body.paleDescription
	    });

	    pale.validate().then(function(err) {
	        if (err) {
	        	req.session.error = [{
	                "message": err.message
	            }];
            	res.redirect("/hour/error");
	        } else {
	            pale.save().then(function() {
	                //res.redirect('/hour');
	            });
	        }
	    }).catch(function(error) {
	        next(error);
	    });
    }
    var i = 1;
    while (req.body['employee'+i] != undefined){
    	var workingday = models.WorkingDay.build({
	   		employeeId : i, //req.body['employee'+i],
	   		userId: req.session.user.id,
	   		workingday: 8,
	   		hours: req.body['hours'+i],
	   		description: '', // req.body['description'+i],
	   		date: req.body['date'+i],
	    });
	    workingday.validate().then(function(err) {
	        if (err) {
		        req.session.error = [{
	                "message": err.message
	            }];
            	res.redirect("/hour/error");
	        }else {
	            workingday.save().then(function() {
	                //res.redirect('/hour');
	            });
	        }
	    }).catch(function(error) {
	        next(error);
	    });
	    i++;
    }
    res.redirect("/hour");
}

exports.find = function(req, res, next) {
   console.log("Find workingday");
}