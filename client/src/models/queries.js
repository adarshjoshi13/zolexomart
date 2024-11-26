module.exports = function (sequelize, DataTypes) {
    return sequelize.define('queries', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fullname: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        service: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        package: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        }    
    }, {
        tableName: 'queries', 
        timestamps: true, 
        createdAt: true,
        updatedAt: false 
    });
};
