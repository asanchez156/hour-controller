// controllers/employeeController.js
var models = require("../models/models.js")

exports.find = function(req, res, next) {
   	var where = {
        //companyId:1
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
    		if (process.env.APP_ENV=='development') console.log("Search Employees", JSON.stringify(searchResult));
    	res.send(JSON.stringify(searchResult));
    });
}

exports.findEmployees = function(search, callback) {
    console.log("search: ", search);
   	models.Employee.findAll({
        where: search,
        include: [models.Company],
        order: [['name', 'ASC']],
    }).then(function(listEmployee) {
    	var searchResult = [];
    	listEmployee.forEach(function(element, index, array){
      		searchResult.push({
      				employeeId: element.employeeId,
              companyId: element.EMPRESA.companyId,
      				employeeName: element.name,
      				companyName: element.EMPRESA.companyName
    		  });
    	});
    	callback(searchResult);
    });
}
