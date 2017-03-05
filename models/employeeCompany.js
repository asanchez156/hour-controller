// models/employee.js

// Definicion del modelo de Employee

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('EMPLEADO_EMPRESA', {
        employeeId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPLEADO',
            primaryKey: true
        },
        companyId:{
            type: DataTypes.INTEGER,
            field: 'ID_EMPRESA',
            primaryKey: true
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
