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
	var promises = []
	var validationErrors = {};
	console.log("BODY: ", req.body);
	var i,j = 1;
	models.transaction(function (t) {
	
	   	promises.push(models.Pale.create({
					   		companyId : 1,
					   		userId: req.session.user.id,
					   		paleNum: req.body.pales,
					   		date: req.body.date0,
					   		description : req.body.paleDescription
						}, {transaction: t}).then(function (pale) {
						}));

   		
   		var eId;
   		var employees = [];
   		var employeeId;

	    while (req.body['employee'+j] != undefined){
	    	employees.push(req.body['employee'+j])
	    	j++;
	    }

	    for( var i = 1; i<j; i++){
	    	employeeId = employees.pop();
			promises.push(models.Employee.findOne({
		        where: {
		            employeeId: parseInt(employeeId || 0)
		        }
		    }).then(function(employee) {
		    		//In this case the employeeId and the iteration are the same
		            console.log("Employee id: ", employee.employeeId);
		            if (employee) {
		            	eId = employee.employeeId;
		            } else {
		            	eId = undefined;
		            }
		            promises.push(models.WorkingDay.create({
				   		employeeId : eId || '',
				   		userId: req.session.user.id,
				   		workingday: 8,
				   		hours: parseFloat(req.body['hours'+eId]),
				   		description: '', // req.body['description'+eId],
				   		date: req.body['date'+eId],
				    }, {transaction: t}).then(function (workingday) {
					}));    
		    }));
		}

	   	return Promise.all(promises);
		
	}).then((results) => {
		res.send({
		   status: 0
		});
	}).catch(function (e) {
		res.status(400).send({
		   message: e.errors[0].message
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
            	$between: [req.body.initialDate , today()]
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
    				employeeName: element.EMPLEADO.name,
    				date: element.date,
    				dateString: spanishDate(element.date),
    				workingday: element.workingday,
    				hours: element.hours,
    				description: element.description,
    				functions:  `<button type="button" class="btn btn-primary" aria-label="Editar" onclick="editWorkingDay(${element.workingdayId})"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></button>&nbsp;<button type="button" class="btn btn-primary" aria-label="Eliminar" onclick="removeWorkingDay(${element.workingdayId})"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>`
			});
    	});
    	//console.log(searchResult);
    	res.send(JSON.stringify(searchResult));         
    });
}

exports.update = function(req, res, next) {
	console.log("BODY: ", req.body);

	models.WorkingDay.update({
		workingdayId : parseInt(req.body.workingdayId)
	},{
		where: {
			employeeId : parseInt(req.body.employeeId),
			userId: req.session.user.id,
			workingday: 8,
			hours: parseFloat(req.body.hours),
			description: req.body.description,
			date: req.body.date
		}
	}).then(function(workingday) {
		res.send(JSON.stringify({
			status: 0,
			message: "Cambios guardados con exito"
		}));
	}).catch(function (e) {
		console.log(e);
	});

	res.send({
		   status: 0
	});
	
}

exports.remove = function(req, res, next) {
	console.log("BODY: ", req.body);
}

function today(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 
	return yyyy+'-'+mm+'-'+dd;
}

function spanishDate(date){
	var today = new Date(date);
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 
	return dd+'/'+mm+'/'+yyyy;
}