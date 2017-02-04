// controllers/paleController.js

var models = require("../models/models.js")

exports.index = function(req, res, next) {
	res.render('pale', {
	    	title: 'Pales',
			parentPage : 'Pantalla principal',
			page: 'pale',
  			user: req.session.user,
  			messages : {error : {}, success:{}}
	    });
}

exports.find = function(req, res, next) {
   	var search = {}

   	if (req.body.companyId){
   		search.companyId = parseInt(req.body.companyId);
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
   	models.pale.findAll({
        where: search,
        include: [models.company],
        order: [['date', 'DESC']],
    }).then(function(listPale) {
    	var searchResult = [];
		listPale.forEach(function(element, index, array){
			searchResult.push({
				paleId: element.paleId,
				companyId: element.companyId,
				companyName: element.EMPRESA.name,
				date: element.date,
				dateString: stringDate(element.date,'es'),
				pale: element.pale,
				description: element.description,
				functions:  `<button type="button" class="btn btn-primary" aria-label="Editar" onclick="editPale(${element.paleId})"><span class="glyphicon glyphicon-edit" aria-hidden="true"></span></button>&nbsp;<button type="button" class="btn btn-primary" aria-label="Eliminar" onclick="removePale(${element.paleId})"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>`
			});
    	});
    	console.log(searchResult);
    	res.send(JSON.stringify(searchResult));
    });
}

exports.create = function(req, res, next) {
	console.log("BODY pale: ", req.body);
	models.transaction(function (t) {
	   	models.Pale.create({
	   		companyId : 1,
	   		userId: req.session.user.id,
	   		paleNum: req.body.pales,
	   		date: req.body.date,
	   		description : req.body.description
		}, {transaction: t}).then(function (pale) {
		});
	}).then((results) => {
		res.send({
		   status: 0
		});
	}).catch(function (err) {
		res.status(400).send({
			status: 1,
		   	message: "No se ha podido crear el pale " + JSON.stringify(err)
		});
	});
}

exports.update = function(req, res, next) {
	console.log("BODY data: ", req.body);

	models.transaction(function (t) {
	  	return models.Pale.findOne({
	  	 	where: {
			  	paleId : parseInt(req.body.paleId)
		 	}
	  	}, { transaction: t}).then(function (pale) {
		    return pale.updateAttributes({
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
		res.status(400).send({
			status: 1,
		   	message: "No se ha podido actualizar el pale " + JSON.stringify(err)
		});
	});
}

exports.delete = function(req, res, next) {
	console.log("BODY: ", req.body);
	models.transaction(function (t) {
	  	return models.Pale.findOne({
	  	 	where: {
			  	paleId : parseInt(req.body.paleId)
		 	}
	  	}, { transaction: t}).then(function (pale) {
		    return pale.destroy({}, { transaction: t});
	  	});
	}).then(function (success) {
		res.send({
		   	status: 0
		});
	}).catch(function (err) {
		res.status(400).send({
			status: 1,
		   	message: "No se ha podido eliminar el pale " + JSON.stringify(err)
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
