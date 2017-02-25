// controllers/userController.js

var models = require("../models/models.js")

exports.autenticar = function(username, password, callback) {
    models.User.findOne({
        where: {
            username: username
        }
    }).then(function(user) {
      // get employee and company
      models.Employee.findOne({
        where: {
            employeeId : user ? user.employeeId : null 
        },
        include : [models.Company]
      }).then(function(employee) {
        var employeeName = null ;
        var employeeSurname = null ;
        var companyId = null ;
        var companyName = null ;
        if(employee){
          employeeName = employee.name;
          employeeSurname = employee.surname;
          companyId = employee.companyId;
          companyName = employee.EMPRESA.companyName;
        }
        if (user) {
            if (password === user.password) {
                callback(null, user, employeeName, employeeSurname, companyId, companyName);
            }
            else {
                callback(new Error('Password erroneo'));
            }
        } else {
            callback(new Error('Usuario incorrecto'));
        }
      });
    });
};
