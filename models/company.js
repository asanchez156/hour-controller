// models/company.js

// Definicion del modelo de Company

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('empresa', {
        companyId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPRESA'
        },
        company: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Falta el nombre de empresa"
                }
            },
            field: 'EMPRESA'
        }
    });
}