// models/employee.js

// Definicion del modelo de Employee

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('EMPLEADO', {
        employeeId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPLEADO',
            primaryKey: true
        },
        companyId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPRESA',
            validate: {
                notEmpty: {
                    msg: "Falta la empresa del empleado"
                }
            }
        },
        positionId:{
            type: DataTypes.INTEGER,
            field: 'ID_CARGO',
            validate: {
                notEmpty: {
                    msg: "Falta el cargo del empleado"
                }
            }
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Falta el nombre del empleado"
                }
            },
            field: 'NOMBRE'
        },
        surname: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Falta el apellido del empleado"
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