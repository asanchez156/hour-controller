// controllers/employeeController.js
var models = require("../models/models.js")

exports.find = function(req, res, next) {
    var where = {
          employeeId:req.session.user.employeeId
   }
    models.Employee.findOne({
       where: where,
       include: [models.Company]
   }).then(function(employee) {
    var searchResult = [];
    if (employee){
        employee.EMPRESAs.forEach(function(company, index, array){
            searchResult.push({
                companyId: company.companyId,
                companyName: company.companyName,
            });
        });
    }
    if (process.env.APP_ENV=='development') console.log("Search Companys on employeeId", JSON.stringify(searchResult));
    res.send(JSON.stringify(searchResult));
   });
}

exports.findCompanys = function(search, callback) {
    var where = {
        employeeId:req.session.user.employeeId
    }
    models.Employee.findOne({
      where: where,
      include: [models.Company]
    }).then(function(employee) {
        var searchResult = [];
        if (employee){
            employee.EMPRESAs.forEach(function(company, index, array){
                searchResult.push({
                    companyId: company.companyId,
                    companyName: company.companyName,
                });
            });
        }
        callback(searchResult);
    });
}
