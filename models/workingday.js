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
            field: 'ID_EMPLEADO'
        },
        userId:{
            type: DataTypes.INTEGER,
            field: 'ID_USUARIO'
        },
        workingday: {
            type: DataTypes.FLOAT,
            validate: {
                notEmpty: {
                    msg: "Falta jornada"
                }
            },
            field: 'JORNADA'
        },
        hours: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Falta las horas realizadas"
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