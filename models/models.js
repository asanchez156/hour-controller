//var config = require('../config');

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/

var databaseUrl = process.env.DATABASE_URL;// || config.mysql.databaseUrl;
//console.log('ENV', process.env.DATABASE_URL);
//console.log('config', config.mysql.databaseUrl);

/*
var url = databaseUrl.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
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

//database wide options
var opts = {
    define: {
        //prevent sequelize from pluralizing table names
        freezeTableName: true
    }
}

var sequelize = new Sequelize(databaseUrl,opts);


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

// Importar la definicion de la tabla EmployeeCompany en employeeCompany.js
var EmployeeCompany = sequelize.import(path.join(__dirname, 'employeeCompany'));

// Relaciones

/*Company.hasMany(Employee,{
  foreignKey: {
    name: 'companyId',
    allowNull: false
  }
});*/
Position.hasMany(Employee,{
  foreignKey: {
    name: 'positionId',
    allowNull: false
  }
});
User.hasMany(WorkingDay,{
  foreignKey: {
    name: 'userId',
    allowNull: false
  }
});
User.hasOne(Employee,{
  foreignKey: {
    name: 'employeeId',
    allowNull: false
  }
});
Employee.hasMany(WorkingDay,{
  foreignKey: {
    name: 'employeeId',
    allowNull: false
  }
});
Company.hasMany(Pale,{
  foreignKey: {
    name: 'companyId',
    allowNull: false
  }
});

WorkingDay.belongsTo(User, { foreignKey: 'userId'});
WorkingDay.belongsTo(Employee, { foreignKey: 'employeeId'});
Employee.belongsTo(User, { foreignKey: 'employeeId' }); // ESTA COGIENDO MAL EL EMPLEADO
//Employee.belongsTo(Company, { foreignKey: 'companyId' });
Employee.belongsToMany(Company, { through: EmployeeCompany, foreignKey: 'employeeId' });
Company.belongsToMany(Employee, { through: EmployeeCompany, foreignKey: 'companyId' });
Employee.belongsTo(Position, { foreignKey: 'positionId' });
Pale.belongsTo(Company, { foreignKey: 'companyId' });
//Employee.belongsToMany(Employee,  { through: UserProject });
//Employee.belongsToMany(Employee, { through: UserProject });

exports.User = User; // exportar la definicion de la tabla User
exports.Position = Position; // exportar la definicion de la tabla Position
exports.Company = Company; // exportar la definicion de la tabla Company
exports.Employee = Employee; // exportar la definicion de la tabla Employee
//exports.EmpEmpPosition = EmpEmpPosition; // exportar la definicion de la tabla EmpEmpPosition
exports.WorkingDay = WorkingDay; // exportar la definicion de la tabla WorkingDay
exports.Pale = Pale; // exportar la definicion de la tabla Pale
exports.EmployeeCompany = EmployeeCompany;

exports.transaction = function (tf) {
    return sequelize.transaction(tf);
  }

exports.query = function (query) {
    return sequelize.query(query);
  }
