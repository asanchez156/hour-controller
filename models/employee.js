// models/employee.js

// Definicion del modelo de Employee

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('empleado', {
        employeeId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPLEADO'
        },
        companyId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPRESA'
        },
        positionId:{
            type: DataTypes.INTEGER,
            field: 'ID_CARGO'
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Falta nombre"
                }
            },
            field: 'NOMBRE'
        },
        surname: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Falta apellido"
                }
            },
            field: 'APELLIDO'
        },
        isDeleted: {
            type: DataTypes.INTEGER(4),
            field: 'IS_DELETED'
        }
    });
}