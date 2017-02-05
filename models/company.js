// models/company.js

// Definicion del modelo de Company

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('EMPRESA', {
        companyId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPRESA',
            primaryKey: true
        },
        companyName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "falta el nombre."
                }
            },
            field: 'NOMBRE_EMPRESA'
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
