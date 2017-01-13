// controllers/hourController.js

var models = require("../models/models.js")

exports.index = function(req, res, next) {
	res.render('hour', {
	    	title: 'Jornadas',
			parentPage : 'Pantalla principal',
			page: 'hour',
  			user: req.session.user,
  			messages : {error : {}, success:{}}
	    });
}

exports.create = function(req, res, next) {
	console.log("Creating working day");
	var promises = []
	var validationErrors = {};
	console.log(req.body);

	models.transaction(function (t) {
	
	   	promises.push(models.Pale.create({
					   		companyId : 1,
					   		userId: req.session.user.id,
					   		paleNum: req.body.pales,
					   		date: req.body.paleDate,
					   		description : req.body.paleDescription
						}, {transaction: t}).then(function (pale) {
						}));

   		var i = 1;
	    while (req.body['employee'+i] != undefined){
	    	promises.push(models.WorkingDay.create({
				   		employeeId : i, //req.body['employee'+i],
				   		userId: req.session.user.id,
				   		workingday: 8,
				   		hours: req.body['hours'+i],
				   		description: '', // req.body['description'+i],
				   		date: req.body['date'+i],
				    }, {transaction: t}).then(function (workingday) {
					}));
		    i++;
		}

	   	return Promise.all(promises);
		
	}).then((results) => {
		res.redirect("/hour");
	}).catch(function (e) {
		console.log(e);
		console.log('finished transaction error');
	});

	/*
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
	    }););
    }*/
    /*
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
	    promisesworkingday.validate().then(function(err) {
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
    */
    //res.redirect("/hour");
}

exports.find = function(req, res, next) {
   console.log("Find workingday");
}