// models/pale.js

// Definicion del modelo de Pale

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('pale', {
        paleId:{
            type: DataTypes.INTEGER,
            field: 'ID_PALE',
            primaryKey: true
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