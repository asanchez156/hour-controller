// controllers/employeeController.js
var models = require("../models/models.js")

exports.find = function(req, res, next) {
   	var where = {
        companyId:1
    }
   	models.Employee.findAll({
        where: where,
        order: [['name', 'ASC']],
    }).then(function(listEmployee) {
    	var searchResult = [];
    	listEmployee.forEach(function(element, index, array){
      		searchResult.push({
      				employeeId: element.employeeId,
      				employeeName: element.name,
    		  });
    	});
    	console.log(searchResult);
    	res.send(JSON.stringify(searchResult));
    });
}

exports.findEmployees = function(callback) {
   	models.Employee.findAll({
        order: [['name', 'ASC']],
    }).then(function(listEmployee) {
    	var searchResult = [];
    	listEmployee.forEach(function(element, index, array){
      		searchResult.push({
      				employeeId: element.employeeId,
              companyId: element.companyId,
      				employeeName: element.name
    		  });
    	});
    	callback(searchResult);
    });
}
