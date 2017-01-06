// models/company.js

// Definicion del modelo de Company

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('EMPRESA', {
        companyId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPRESA',
            primaryKey: true
        },
        company: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Falta el nombre de empresa"
                }
            },
            field: 'EMPRESA'
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