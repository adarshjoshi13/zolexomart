const sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('mailinfo', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            validate: {
                notEmpty: true
            }
        },
        full_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100] 
            }
        },
        mobile: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                notEmpty: true,
                isInt: true,  
                len: [10, 15] 
            }
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true, 
                len: [5, 100] 
            }
        },
        query: {  
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true 
            }
        }
    }, {
        sequelize,
        tableName: 'mailinfo',
        timestamps: true, 
        updatedAt: false  
    });
};
