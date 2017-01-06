// models/pale.js

// Definicion del modelo de Pale

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('PALE', {
        paleId:{
            type: DataTypes.INTEGER,
            field: 'ID_PALE',
            primaryKey: true
        },
        userId:{
            type: DataTypes.INTEGER,
            field: 'ID_USUARIO'
        },
        companyId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPRESA'
        },
        paleNum:{
            type: DataTypes.FLOAT,
            validate: {
                notEmpty: {
                    msg: "-> Falta el número de pales"
                }
            },
            field: 'NUM_PALE'
        },
        date: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: {
                    msg: "-> Falta la fecha de la jornada"
                }
            },
            field: 'FECHA'
        },
        description: {
            type: DataTypes.STRING,
            field: 'OBSERVACIONES'
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