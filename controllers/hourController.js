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

exports.createBatch = function(req, res, next) {
	var promises = []
	var validationErrors = {};
	if (process.env.APP_ENV=='development') console.log("Create day batch body: ", JSON.stringify(req.body));
	var i,j = 1;
	models.transaction(function (t) {

	   	promises.push(models.Pale.create({
	   		companyId : 1,
	   		userId: req.session.user.id,
	   		paleNum: req.body.pales,
	   		date: req.body.dateBatch,
	   		description : req.body.paleDescription
		}, {transaction: t}).then(function (pale) {
		}));

   		var eId;
   		var employees = [];
   		var employeeId;

	    while (req.body['employeeBatch'+j] != undefined){
	    	employees.push(req.body['employeeBatch'+j])
	    	j++;
	    }

	    for( var i = 1; i<j; i++){
	    	employeeId = employees.pop();
				promises.push(models.WorkingDay.create({
				   		employeeId : employeeId || '',
				   		userId: req.session.user.id,
				   		workingday: 8,
				   		hours: parseFloat(req.body['hoursBatch'+eId]),
				   		description: req.body['descriptionBatch'+eId],
				   		date: req.body['dateBatch'],
						}, {transaction: t}).then(function (workingday) {
				}));
		}

	   	return Promise.all(promises);

	}).then((results) => {
		res.send({
		   status: 0
		});
	}).catch(function (err) {
		if (process.env.APP_ENV=='development') console.log("Create day batch error:", JSON.stringify(err));
		res.status(400).send({
			status: 1,
		   	message: err.errors[0].message
		});
	});
}

exports.find = function(req, res, next) {
   	var search = {}

   	if (req.body.employeeId){
   		search.employeeId = parseInt(req.body.employeeId);
   	}
   	if (req.body.initialDate && req.body.endDate){
   		search.date = {
            	$between: [req.body.initialDate , req.body.endDate]
            }
   	}else if (req.body.initialDate){
   		search.date = {
            	$between: [req.body.initialDate , stringDate('','en')]
            }
   	}else if (req.body.endDate){
   		search.date = {
            	$between: ["Fri Jan 1 2010 01:00:00 GMT+0100 (CET)'", req.body.endDate]
            }
   	}
   	models.WorkingDay.findAll({
        where: search,
        include: [models.Employee],
        order: [['date', 'DESC']],
    }).then(function(listWorkingday) {
    	var searchResult = [];
			listWorkingday.forEach(function(element, index, array){
					searchResult.push({
							workingdayId: element.workingdayId,
							employeeId: element.employeeId,
							employeeName: element.EMPLEADO ? element.EMPLEADO.name : "null",
							date: element.date,
							dateString: stringDate(element.date,'es'),
							workingday: element.workingday,
							hours: element.hours,
							description: element.description,
							functions:  `<button type="button" class="btn btn-primary" aria-label="Editar" onclick="editWorkingDay(${element.workingdayId})"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></button>&nbsp;<button type="button" class="btn btn-primary" aria-label="Eliminar" onclick="deleteWorkingDay(${element.workingdayId})"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>`
					});
	    });
    	if (process.env.APP_ENV=='development') console.log("Search Workingdays", JSON.stringify(searchResult));
    	res.send(JSON.stringify(searchResult));
  });
}

exports.create = function(req, res, next) {
	if (process.env.APP_ENV=='development') console.log("Create WorkingDay body: ", JSON.stringify(req.body));
	models.transaction(function (t) {
	    return models.WorkingDay.create({
		   		employeeId : req.body.employeeId,
		   		userId: req.session.user.id,
		   		workingday: 8,
		   		hours: parseFloat(req.body.hours),
		   		description: req.body.description,
		   		date: req.body.date,
		    }, {transaction: t});
	}).then((results) => {
		res.send({
		   status: 0
		});
	}).catch(function (err) {
		if (process.env.APP_ENV=='development') console.log("Create WorkingDay error: ", JSON.stringify(err));
		res.status(400).send({
			status: 1,
		   	message: "No se ha podido crear la jornada " + (err.errors[0].message == "JOR_UK must be unique" ? "ya existe." : err.errors[0].message)
		});
	});
}

exports.update = function(req, res, next) {
	if (process.env.APP_ENV=='development') console.log("Update WorkingDay body: ", JSON.stringify(req.body));
	models.transaction(function (t) {
	  	return models.WorkingDay.findOne({
	  	 	where: {
			  	workingdayId : parseInt(req.body.workingdayId)
		 	}
	  	}, { transaction: t}).then(function (workingday) {
		    return workingday.updateAttributes({
		    	userId: req.session.user.id,
		    	hours: req.body.hours,
		    	description: req.body.description
		    }, { transaction: t});
	  	});
	}).then(function (success) {
		res.send({
		   	status: 0
		});
	}).catch(function (err) {
		if (process.env.APP_ENV=='development') console.log("Update WorkingDay error: ", JSON.stringify(err));
		res.status(400).send({
			status: 1,
		   	message: "No se ha podido eliminar la jornada " + err.errors[0].message
		});
	});

}

exports.delete = function(req, res, next) {
	if (process.env.APP_ENV=='development') console.log("Delete WorkingDay body: ", JSON.stringify(req.body));
	models.transaction(function (t) {
	  	return models.WorkingDay.findOne({
	  	 	where: {
			  	workingdayId : parseInt(req.body.workingdayId)
		 	}
	  	}, { transaction: t}).then(function (workingday) {
		    return workingday.destroy({}, { transaction: t});
	  	});
	}).then(function (success) {
		res.send({
		   	status: 0
		});
	}).catch(function (err) {
		if (process.env.APP_ENV=='development') console.log("Delete WorkingDay error: ", JSON.stringify(err));
		res.status(400).send({
			status: 1,
		   	message: "No se ha podido eliminar la jornada " + err.errors[0].message
		});
	});
}

function stringDate(date,lg){
	var today = new Date(date);
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) dd='0'+dd;

	if(mm<10) mm='0'+mm;

	var stringDate = '';

	switch (lg) {
	  	case 'es':
	  		stringDate = dd+'/'+mm+'/'+yyyy;
	    	break;
	  	case 'en':
	  		stringDate = yyyy+'/'+mm+'/'+dd;
	    	break;
	  	default:
	  		stringDate = yyyy+'/'+mm+'/'+dd;
	    	break;
	}
	return stringDate;
}
