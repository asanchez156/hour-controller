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
      				name: element.name,
    		  });
    	});
    	console.log(searchResult);
    	res.send(JSON.stringify(searchResult));
    });
}
