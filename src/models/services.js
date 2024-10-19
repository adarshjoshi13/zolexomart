const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('services', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1 
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true 
    },
    serviceName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subImageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bannerImageUrl: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    mainImageUrl: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    subDescription: {
      type: DataTypes.STRING,
      allowNull: true
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true
    },
    cards: {
      type: DataTypes.JSON,
      allowNull: true
    },
    benefits: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ourApproach: {
      type: DataTypes.JSON,
      allowNull: true
    },
    userFriendly: {
      type: DataTypes.JSON,
      allowNull: true
    },
    faq: {
      type: DataTypes.JSON,
      allowNull: true
    },
    seo: {
      type: DataTypes.JSON,
      allowNull: true
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: true, 
  });
};
