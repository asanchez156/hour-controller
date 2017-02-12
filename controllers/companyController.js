// controllers/employeeController.js
var models = require("../models/models.js")

exports.find = function(req, res, next) {
   	var where = {
//        companyId:1
    }
   	models.Company.findAll({
        where: where,
        order: [['companyName', 'ASC']],
    }).then(function(listCompany) {
    	var searchResult = [];
    	listCompany.forEach(function(element, index, array){
      		searchResult.push({
      				companyId: element.companyId,
      				companyName: element.companyName,
    		  });
    	});
    	console.log(searchResult);
    	res.send(JSON.stringify(searchResult));
    });
}

exports.findCompanys = function(callback) {
   	models.Company.findAll({
        order: [['companyName', 'ASC']],
    }).then(function(listCompany) {
    	var searchResult = [];
    	listCompany.forEach(function(element, index, array){
      		searchResult.push({
      				companyId: element.companyId,
      				companyName: element.companyName
    		  });
    	});
    	callback(searchResult);
    });
}
