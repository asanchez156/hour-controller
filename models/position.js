// models/position.js

// Definicion del modelo de Position

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('cargo', {
        positionId:{
            type: DataTypes.INTEGER,
            field: 'ID_CARGO'
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
        }
    });
}