// models/position.js

// Definicion del modelo de Position

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('CARGO', {
        positionId:{
            type: DataTypes.INTEGER,
            field: 'ID_CARGO',
            primaryKey: true
        },
        position: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "-> Falta el cargo"
                }
            },
            field: 'CARGO'
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