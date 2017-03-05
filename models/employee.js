// models/employee.js

// Definicion del modelo de Employee

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('EMPLEADO', {
        employeeId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPLEADO',
            primaryKey: true
        },
        positionId:{
            type: DataTypes.INTEGER,
            field: 'ID_CARGO',
            validate: {
                notEmpty: {
                    msg: "falta el cargo"
                }
            }
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "falta el nombre"
                }
            },
            field: 'NOMBRE'
        },
        surname: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "falta el apellido"
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
