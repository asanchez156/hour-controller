// models/user.js

// Definicion del modelo de User

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('USUARIO', {
        userId:{
            type: DataTypes.INTEGER,
            field: 'ID_USUARIO',
            primaryKey : true
        },
        employeeId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPLEADO',
            validate: {
                notEmpty: {
                    msg: "falta el usuario."
                }
            }
        },
        username: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "falta nombre de usuario del usuario."
                }
            },
            field: 'NOMBRE_USUARIO'
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "falta la contraseña del usuario."
                }
            },
            field: 'PASSWORD'
        },
        firstName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "falta el nombre del usuario."
                }
            },
            field: 'NOMBRE'
        },
        lastName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "falta el nombre del usuario"
                }
            },
            field: 'APELLIDO'
        },
        userMode: {
            type: DataTypes.INTEGER,
            field: 'MODO_USUARIO'
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
