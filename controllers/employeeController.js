// controllers/employeeController.js
var models = require("../models/models.js")

exports.find = function(req, res, next) {
    // se obtendran los empleados de los que se encarga el usuario registrado
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
    console.log("search employees: ", search);
   	models.Employee.findAll({
        where: {
            //employeeId : search.employeeId
        },
        include: [models.Company],
        order: [['name', 'ASC']],
    }).then(function(listEmployee) {
        console.log("found employees: ", JSON.stringify(listEmployee));
    	var searchResult = [];
    	listEmployee.forEach(function(element, index, array){
      		searchResult.push({
      				employeeId: element.employeeId,
              //companyId: element.EMPRESAs.companyId,
      				employeeName: element.name,
      				//companyName: element.EMPRESAs.companyName
    		  });
    	});
      console.log("END findEmployees");
    	callback(searchResult);
    });
}
