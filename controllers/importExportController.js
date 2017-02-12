// controllers/importExportController.js
var models = require("../models/models.js");
//var xlsx = require('node-xlsx');

//http://stackoverflow.com/questions/28860728/reading-excel-file-using-node-js

exports.import = function(req, res, next) {
    //var obj = xlsx.parse(__dirname + '/myFile.xlsx'); // parses a file
    //var obj = xlsx.parse(fs.readFileSync(__dirname + '/myFile.xlsx')); // parses a buffer
    res.send('');
}

exports.export = function(req, res, next) {
    res.send('');
}
