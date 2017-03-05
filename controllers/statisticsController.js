// controllers/statisticsController.js
var employeeController = require("./employeeController.js")
var companyController = require("./companyController.js")
var models = require("../models/models.js")

exports.index = function(req, res, next) {
    res.render('statistics', {
	    	title: 'Estadísticas',
			  parentPage : 'Pantalla principal',
			  page: 'statistics',
  			user: req.session.user,
  			messages : {error : {}, success:{}}
	  });
}

exports.findWorkingday = function(req, res, next) {
  console.log("findWorkingday");

  var search = {}
  var startYear = 2017;
  var currentYear = new Date().getFullYear();

  if (req.body.companyId){
      search.companyId = parseInt(req.body.companyId);
  }
  if (req.body.employeeId){
      search.employeeId = parseInt(req.body.employeeId);
  }

  //initializing variables
  var searchResult = {};

  employeeController.findEmployees(search,function(employees){
      employees.forEach(function(employee, index, array){
          if (!req.body.employeeId || (req.body.employeeId ? req.body.employeeId==employee.employeeId : false)){
              employee.result = [];
              for (var j = startYear; j<=currentYear; j++){
                  employee.result.push({year:j, total:[0,0,0] , month:[[0,0,0],[0,0,0],[0,0,0],[0,0,0],
                    [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]})
              }
              searchResult[employee.employeeId] = employee;
          }
      });
  });
  var date,mm,yyyy;
  var i = 0;
  var sumMonth, sumYear = [0,0];

  models.WorkingDay.findAll({
      where: search,
      include: [models.Employee],
      order: [[{ raw: 'date DESC' }]]//[['date', 'DESC']]
  }).then(function(listWorkingDay) {
      listWorkingDay.forEach(function(element, index){
          date = new Date(element.date);
          mm = date.getMonth();
          yyyy = date.getFullYear();
          if(yyyy<=currentYear){
              var result = searchResult[element.employeeId].result[yyyy-startYear];
              result.month[mm][0] += element.workingday;
              result.month[mm][1] += element.hours;
              result.month[mm][2] += element.workingday - element.hours;
              result.total[0] += element.workingday;
              result.total[1] += element.hours;
              result.total[2] += element.workingday - element.hours;
          }
      });
      if (process.env.APP_ENV=='development') console.log("JSON-workingday",JSON.stringify(searchResult));
      res.send(JSON.stringify(searchResult));
   });
}

exports.findPale = function(req, res, next) {
    var search = {}
    var startYear = 2017;
    var currentYear = new Date().getFullYear();

    if (req.body.companyId){
        search.companyId = parseInt(req.body.companyId);
    }
    //initializing variables
    var searchResult = {};
    companyController.findCompanys(search, function(companys){
      companys.forEach(function(company, index, array){
        if (!req.body.companyId || (req.body.companyId ? req.body.companyId==company.companyId : false)){
          company.result = [];
          for (var j = startYear; j<=currentYear; j++){
              company.result.push({year:j, total:0 , month:[0,0,0,0,0,0,0,0,0,0,0,0]})
          }
          searchResult[company.companyId] = company;
        }
      })
    });
    var date,mm,yyyy;
    var sumMonth, sumYear = 0;

    models.Pale.findAll({
        where: search,
        include: [models.Company],
        order: [[{ raw: 'date + companyId DESC' }]]//[['date', 'DESC']]
    }).then(function(listPale) {
        listPale.forEach(function(element, index){
            date = new Date(element.date);
            mm = date.getMonth();
            yyyy = date.getFullYear();
            if(yyyy<=currentYear){
                var result = searchResult[element.companyId].result[yyyy-startYear];
                result.month[mm] += element.paleNum;
                result.total += element.paleNum;
            }
        });
        if (process.env.APP_ENV=='development') console.log("JSON-pale",JSON.stringify(searchResult));
        res.send(JSON.stringify(searchResult));
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
