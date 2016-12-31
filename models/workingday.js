// models/workingday.js

// Definicion del modelo de Workingday

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('jornada', {
        workingdayId:{
            type: DataTypes.INTEGER,
            field: 'ID_JORNADA'
        },
        companyId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPRESA'
        },
        userId:{
            type: DataTypes.INTEGER,
            field: 'ID_USUARIO'
        },
        workingday: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Falta jornada"
                }
            },
            field: 'JORNADA'
        },
        hours: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Falta las horas realizadas"
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
                    msg: "-> Falta la fecha de la jornada"
                }
            },
            field: 'FECHA'
        }
    });
}