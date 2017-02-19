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
    		if (process.env.APP_ENV=='development') console.log("Search Companys", JSON.stringify(searchResult));
    	res.send(JSON.stringify(searchResult));
    });
}

exports.findCompanys = function(search, callback) {
   	models.Company.findAll({
        where: search,
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
