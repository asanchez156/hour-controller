// controllers/importExportController.js
var models = require("../models/models.js");
var employeeController = require("./employeeController.js");
var XLSX = require('xlsx');

//http://stackoverflow.com/questions/28860728/reading-excel-file-using-node-js

var Workingday = function (employeeName, date, workingday, hours, description){
  return {
      employeeName : employeeName,
      date : date,
      workingday : workingday,
      hours : hours,
      description : description
  }
}

exports.importWorkingDay = function(req, res, next) {
    var fileContent = '';
    var myExcel = XLSX.readFile(__dirname + '/../public/assets/excel/example.xlsx'); // parses a file
    //var obj = xlsx.parse(fs.readFileSync(__dirname + '/myFile.xlsx')); // parses a buffer
    var hoja1 = myExcel.Sheets[myExcel.SheetNames[0]];
    var ref = hoja1['!ref'];
    //console.log(JSON.stringify(myExcel));
    if (ref.includes('A1:E')){
        var start = ['A',1];
        var end = ['E', parseInt(ref.substr(ref.indexOf('E')+1)) ]
        //console.log('!ref', hoja1['!ref']);
        //console.log("start",start);
        //console.log("end",end);
        //console.log("JSON-hoja1",JSON.stringify(hoja1));
        var workingdayList=[];
        for (var i = 2; i < end[1]; i++){
            if (!hoja1[`A${i}`] && !hoja1[`B${i}`] && !hoja1[`C${i}`] && !hoja1[`D${i}`]) break;
            if (!hoja1[`A${i}`]) res.send(JSON.stringify({status:1, message: `Fichero mal construido, falta la celda A${i}`}));
            if (!hoja1[`B${i}`]) res.send(JSON.stringify({status:1, message: `Fichero mal construido, falta la celda B${i}`}));
            if (!hoja1[`C${i}`]) res.send(JSON.stringify({status:1, message: `Fichero mal construido, falta la celda C${i}`}));
            if (!hoja1[`D${i}`]) res.send(JSON.stringify({status:1, message: `Fichero mal construido, falta la celda D${i}`}));
            var workingday = new Workingday(hoja1[`A${i}`].v, stringDate(new Date(hoja1[`B${i}`].w)),
            hoja1[`C${i}`].v, hoja1[`D${i}`].v, hoja1[`E${i}`] ? hoja1[`E${i}`].v : '');
            workingdayList.push(workingday);
        }
        var promises = [];
        models.transaction(function (t) {
            workingdayList.forEach(function(wd, index, array){
              promises.push(models.Employee.findOne({
                  where: {
                      name : wd.employeeName
                  }
              }).then(function(employee) {
               	   return models.WorkingDay.create({
           				   		employeeId : employee.employeeId,
           				   		userId: req.session.user.id,
                         date: wd.date,
           				   		workingday: parseFloat(wd.workingday),
           				   		hours: parseFloat(wd.hours),
           				   		description: wd.description
           						}, {transaction: t}).then(function (workingday) {
                 		});
              }));
            });
            console.log("workingdayList", JSON.stringify(workingdayList));
      	   	return Promise.all(promises);
      	}).then((results) => {
      		res.send({ status: 0 , workingdayList: workingdayList});
      	}).catch(function (err) {
        		if (process.env.APP_ENV=='development') console.log(JSON.stringify(err));
            var errorWorkingDayDate = err.errors[0].value.substr(err.errors[0].value.indexOf('-')+1);
            var errorWorkingDayEmployeeId = err.errors[0].value.substr(0,err.errors[0].value.indexOf('-'))|'';

            if (errorWorkingDayEmployeeId!=''){
                models.Employee.findOne({
                    where: {
                        employeeId : errorWorkingDayEmployeeId
                    }
                    }).then(function(employee) {
                        res.status(400).send({
                            status: 1,
                            message: "La jornada (Empleado: " + employee.name + ", Fecha: " + stringDate(errorWorkingDayDate,'es') + ") ya existe."
                        });
                });
            } else {
                res.status(400).send({
                    status: 1,
                    message: "Error desconocido importando el fichero."
                });
            }
      	});
    } else{
        res.send(JSON.stringify({status:1, message: `Fichero mal construido, ten ecuenta que el contenido ha de ir en la primera página.`}));
    }
}

exports.exportWorkingDay = function(req, res, next) {
    res.send('');
}

exports.importPale = function(req, res, next) {
    res.send('');
}

exports.exportPale = function(req, res, next) {
    res.send('');
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
  	  		 stringDate = yyyy+'-'+mm+'-'+dd;
  	    	   break;
  	}
  	return stringDate;
}
