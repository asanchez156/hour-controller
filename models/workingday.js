// models/workingday.js

// Definicion del modelo de Workingday

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('JORNADA', {
        workingdayId:{
            type: DataTypes.INTEGER,
            field: 'ID_JORNADA',
            primaryKey: true
        },
        employeeId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPLEADO',
            validate: {
                notEmpty: {
                    msg: "falta el empleado."
                }
            }
        },
        userId:{
            type: DataTypes.INTEGER,
            field: 'ID_USUARIO',
            validate: {
                notEmpty: {
                    msg: "falta el usuario."
                }
            }
        },
        workingday: {
            type: DataTypes.FLOAT,
            validate: {
                notEmpty: {
                    msg: "falta la jornada."
                }
            },
            field: 'JORNADA'
        },
        hours: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "faltan las horas realizadas."
                }
            },
            field: 'HORAS_REALIZADAS'
        },
        description: {
            type: DataTypes.STRING,
            field: 'OBSERVACIONES'
        },
        date: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: {
                    msg: "Falta la fecha de la jornada"
                }
            },
            field: 'FECHA'
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
