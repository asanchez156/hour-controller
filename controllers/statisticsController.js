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
  var searchResult = [];
  var year = [];

  for (var j = startYear; j<=currentYear; j++){
      year.push({year:j, total:[0,0] , month:[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]})
  }
  employeeController.findEmployees(search,function(employees){
    employees.forEach(function(employee, index, array){
      if (!req.body.employeeId || (req.body.employeeId ? req.body.employeeId==employee.employeeId : false)){
        employee.result = year.slice();
        searchResult.push(employee);
      }
    })
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
              i=0;
              while (i<searchResult.length && searchResult[i].employeeId!=element.employeeId){
                  i++;
              }
              console.log("BUCLE",i);
              if(searchResult[i].employeeId==element.employeeId){
                  console.log("result",i);
                  console.log(searchResult);
                  searchResult[i].result[yyyy-startYear].month[mm][0] += element.workingday;
                  searchResult[i].result[yyyy-startYear].month[mm][1] += element.hours;
                  searchResult[i].result[yyyy-startYear].total[0] += element.workingday;
                  searchResult[i].result[yyyy-startYear].total[1] += element.hours;
                  console.log(searchResult[0].result[yyyy-startYear].month[mm][0]);
                  console.log(searchResult[1].result[yyyy-startYear].month[mm][0]);
              }
          }
      });
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
    var searchResult = [];
    var year = [];

    for (var j = startYear; j<=currentYear; j++){
        year.push({year:j, total:0 , month:[0,0,0,0,0,0,0,0,0,0]})
    }
    companyController.findCompanys(search, function(companys){
      companys.forEach(function(company, index, array){
        if (!req.body.companyId || (req.body.companyId ? req.body.companyId==company.companyId : false)){
          company.result = year.slice();
          searchResult.push(company);
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
                searchResult.find(function(company){
                  company.result[yyyy-startYear].month[mm] += element.paleNum;
                  company.result[yyyy-startYear].total += element.paleNum;
                }, {companyId:element.companyId});
            }
        });
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
