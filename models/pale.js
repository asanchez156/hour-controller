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
            field: 'ID_USUARIO',
            validate: {
                notEmpty: {
                    msg: "Falta el usuario del pale"
                }
            }
        },
        companyId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPRESA',
            validate: {
                notEmpty: {
                    msg: "Falta la empresa del pale"
                }
            }
        },
        paleNum:{
            type: DataTypes.FLOAT,
            validate: {
                notEmpty: {
                    msg: "Falta el número de pales"
                }
            },
            field: 'NUM_PALE'
        },
        date: {
            type: DataTypes.DATE,
            validate: {
                notEmpty: {
                    msg: "Falta la fecha del pale"
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