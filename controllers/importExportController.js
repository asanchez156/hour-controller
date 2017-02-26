// controllers/importExportController.js
var models = require("../models/models.js");

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
  if (req.body.excelFile){
    var myExcel = req.body.excelFile;
    if (process.env.APP_ENV=='development') console.log("Import workingday excel", JSON.stringify(myExcel));
    var hoja1 = myExcel.Sheets[myExcel.SheetNames[0]];
    var ref = hoja1['!ref'];

    if (ref && ref.includes('A1:E')){
            var start = ['A',1];
            var end = ['E', parseInt(ref.substr(ref.indexOf('E')+1)) ]

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
            var promisesWorkingDay = [];
            models.transaction(function (t) {
                workingdayList.forEach(function(wd, index, array){
                  promisesWorkingDay.push(models.Employee.findOne({
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
          	   	return Promise.all(promisesWorkingDay);
          	}).then((results) => {
          		res.send({ status: 0 , workingdayList: workingdayList});
          	}).catch(function (err) {
            		if (process.env.APP_ENV=='development') console.log(JSON.stringify(err));
                var errorWorkingDayDate = err.errors[0].value.substr(err.errors[0].value.indexOf('-')+1);
                var errorWorkingDayEmployeeId = err.errors[0].value.substr(0,err.errors[0].value.indexOf('-'))|'';
                console.log(errorWorkingDayDate, errorWorkingDayEmployeeId);
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
            res.status(400).send({status:1, message: `Fichero mal construido, ten en cuenta que el contenido ha de ir en la primera página.`});
        }
      } else {
         res.status(400).send({status:1, message: `No existe el fichero o es incorrecto`});
      }
}

exports.exportWorkingDay = function(req, res, next) {
    res.send('');
}

var Pale = function (companyName, date, paleNum, description){
  return {
      companyName : companyName,
      date : date,
      paleNum : paleNum,
      description : description
  }
}

exports.importPale = function(req, res, next) {
  if (req.body.excelFile){
    var myExcel = req.body.excelFile;
    if (process.env.APP_ENV=='development') console.log("Import pale excel", JSON.stringify(myExcel));
    var hoja1 = myExcel.Sheets[myExcel.SheetNames[0]];
    var ref = hoja1['!ref'];

    if (ref && ref.includes('A1:D')){
        var start = ['A',1];
        var end = ['D', parseInt(ref.substr(ref.indexOf('D')+1)) ]

        var paleList=[];
        for (var i = 2; i < end[1]; i++){
            if (!hoja1[`A${i}`] && !hoja1[`B${i}`] && !hoja1[`C${i}`]) break;
            if (!hoja1[`A${i}`]) res.send(JSON.stringify({status:1, message: `Fichero mal construido, falta la celda A${i}`}));
            if (!hoja1[`B${i}`]) res.send(JSON.stringify({status:1, message: `Fichero mal construido, falta la celda B${i}`}));
            if (!hoja1[`C${i}`]) res.send(JSON.stringify({status:1, message: `Fichero mal construido, falta la celda C${i}`}));
            var pale = new Pale(hoja1[`A${i}`].v, stringDate(new Date(hoja1[`B${i}`].w)),
            hoja1[`C${i}`].v, hoja1[`D${i}`] ? hoja1[`D${i}`].v : '');
            paleList.push(pale);
        }
        var promisesPale = [];
        models.transaction(function (t) {
            paleList.forEach(function(p, index, array){
              promisesPale.push(models.Company.findOne({
                  where: {
                      companyName : p.companyName
                  }
              }).then(function(company) {
                   return models.Pale.create({
                       companyId : company.companyId,
                       userId: req.session.user.id,
                       paleNum: p.paleNum,
                       date: p.date,
                       description : p.description
                      }, {transaction: t}).then(function (pale) {
                    });
              }));
            });
            console.log("paleList", JSON.stringify(paleList));
            return Promise.all(promisesPale);
        }).then((results) => {
          res.send({ status: 0 , paleList: paleList});
        }).catch(function (err) {
            if (process.env.APP_ENV=='development') console.log(JSON.stringify(err));
            var errorPaleDate = err.errors[0].value.substr(err.errors[0].value.indexOf('-')+1);
            var errorPaleCompanyId = err.errors[0].value.substr(0,err.errors[0].value.indexOf('-'))|'';

            if (errorPaleCompanyId!=''){
                models.Company.findOne({
                    where: {
                        companyId : errorPaleCompanyId
                    }
                    }).then(function(company) {
                        res.status(400).send({
                            status: 1,
                            message: "El pale (Empresa: " + company.companyName + ", Fecha: " + stringDate(errorPaleDate,'es') + ") ya existe."
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
        res.status(400).send({status:1, message: `Fichero mal construido, ten en cuenta que el contenido ha de ir en la primera página.`});
    }
  } else {
      res.status(400).send({status:1, message: `No existe el fichero o es incorrecto`});
  }
}

exports.exportPale = function(req, res, next) {
    console.log("Export Workbook");
    var workbook = XLSX.readFile(__dirname + '/../public/assets/excel/pales.xlsx');
    //console.log("Workbook", JSON.stringify(workbook));
    var hoja1 = workbook.Sheets[workbook.SheetNames[0]];
    var ref = hoja1['!ref'];

    if (ref && ref.includes('A1:D')){
        var start = ['A',1];
        var end = ['D', parseInt(ref.substr(ref.indexOf('D')+1)) ]
        console.log("hoja1", JSON.stringify(hoja1));

        /*
        var paleList=[];
        for (var i = 2; i < 3; i++){
          "A2":{"t":"s","v":"Netto Mendibil","r":"<t>Netto Mendibil</t>","h":"Netto Mendibil","w":"Netto Mendibil"},"B2":{"t":"n","v":"42736","w":"1/1/17"},"C2":{"t":"n","v":"8","w":"8"},"A3":{"t":"s","v":"Netto Mendibil","r":"<t>Netto Mendibil</t>","h":"Netto Mendibil","w":"Netto Mendibil"}
            hoja1[`A${i}`]={ t : "s",
                             v : "Netto Mendibil",
                             h : "Netto Mendibil",
                             w : "Netto Mendibil",
                            }
            hoja1[`A${i}`].v;
            hoja1[`B${i}`].w;
            hoja1[`C${i}`].v;
            hoja1[`D${i}`].v;

        }*/
    }

    //var xlsx = XLSX.writeFile(workbook, 'pales.xlsx');
    if (process.env.APP_ENV=='development') console.log("Import pale excel", JSON.stringify(xlsx));
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
