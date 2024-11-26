const sequelize = require('sequelize')

module.exports = function (sequelize, DataTypes) {

  return sequelize.define('users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

};
