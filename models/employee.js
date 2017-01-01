// models/employee.js

// Definicion del modelo de Employee

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('empleado', {
        employeeId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPLEADO',
            primaryKey: true
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
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'CREATE_DATE'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'MODIFY_DATE'
        }
    });
}