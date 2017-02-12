// controllers/statisticsController.js
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

exports.findPale = function(req, res, next) {

    //Devolver un Json con el nombre de la empresa el resumen del mes X por cada año X
    // y el total de cada año x.

    var search = {}
    var startYear = 2017;
    var currentYear = new Date().getFullYear()+1;
    console.log("Body findPale", req.body);
    if (req.body.companyId){
        search.companyId = parseInt(req.body.companyId);
    }
    //initializing variables
    var searchResult = [];
    var year = [];

    for (var j = startYear; j<=currentYear; j++){
        year.push({year:j, total:0 , month:[0,0,0,0,0,0,0,0,0,0]})
    }
    companyController.findCompanys(function(companys){
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
            //if(req.body.month==(mm+1)){}
            //if(req.body.year==(yyyy)){}
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
exports.findWorkingday = function(req, res, next) {
  console.log("findWorkingday");
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
