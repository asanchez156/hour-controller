var config = require('../config');

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
/*
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;
*/

// Cargar Modelo ORM
var Sequelize = require('sequelize');


// Usar BBDD SQLite o Postgres
/*
var sequelize = new Sequelize(DB_name, user, pwd, {
  dialect: protocol,
  protocol: protocol,
  port: port,
  host: host,
  storage: storage, // solo SQLite (.env)
  omitNull: true
});
*/

//database wide options
var opts = {
    define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true
    }
}

var sequelize = new Sequelize('mysql://'+config.mysql.user+':'+
    config.mysql.password+'@'+config.mysql.host+':3306/'+config.mysql.database, opts);

// Importar la definicion de la tabla User en user.js
var User = sequelize.import(path.join(__dirname, 'user'));

// Importar la definicion de la tabla Position en position.js
var Position = sequelize.import(path.join(__dirname, 'position'));

// Importar la definicion de la tabla Company en company.js
var Company = sequelize.import(path.join(__dirname, 'company'));

// Importar la definicion de la tabla Employee en employee.js
var Employee = sequelize.import(path.join(__dirname, 'employee'));

// Importar la definicion de la tabla EmpEmpPosition en empempposition.js
//var EmpEmpPosition = sequelize.import(path.join(__dirname, 'empempposition'));

// Importar la definicion de la tabla WorkingDay en workingday.js
var WorkingDay = sequelize.import(path.join(__dirname, 'workingday'));

// Importar la definicion de la tabla Pale en pale.js
var Pale = sequelize.import(path.join(__dirname, 'pale'));

// Relaciones

Employee.hasMany(Company,{
  foreignKey: {
    name: 'companyId',
    allowNull: false
  }
});
Employee.hasMany(Position,{
  foreignKey: {
    name: 'positionId',
    allowNull: false
  }
});
WorkingDay.hasMany(User,{
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});
WorkingDay.hasMany(Employee,{
  foreignKey: {
    name: 'employeeId',
    allowNull: false
  }
});
Pale.hasMany(Company,{
  foreignKey: {
    name: 'companyId',
    allowNull: false
  }
});

//Employee.belongsToMany(EmpEmpPosition, { through: UserProject });
//Employee.belongsToMany(EmpEmpPosition, { through: UserProject });

exports.User = User; // exportar la definicion de la tabla User
exports.Position = Position; // exportar la definicion de la tabla Position
exports.Company = Company; // exportar la definicion de la tabla Company
exports.Employee = Employee; // exportar la definicion de la tabla Employee
//exports.EmpEmpPosition = EmpEmpPosition; // exportar la definicion de la tabla EmpEmpPosition
exports.WorkingDay = WorkingDay; // exportar la definicion de la tabla WorkingDay
exports.Pale = Pale; // exportar la definicion de la tabla Pale

exports.transaction = function (tf) { 
    return sequelize.transaction(tf);
  }