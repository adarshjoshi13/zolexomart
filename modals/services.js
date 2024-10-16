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
    mainImageUrl: {
      type: DataTypes.STRING,
      allowNull: false 
    },
    subDescription: {
      type: DataTypes.STRING,
      allowNull: true // Can be nullable if not every service has a mainImage
    },
    details: {
      type: DataTypes.JSON, // Storing details as JSON
      allowNull: true
    },
    cards: {
      type: DataTypes.JSON, // Storing card information as JSON array
      allowNull: true
    },
    benefits: {
      type: DataTypes.JSON, // Storing benefits as JSON
      allowNull: true
    },
    faq: {
      type: DataTypes.JSON, // Storing FAQs as JSON array
      allowNull: true
    },
    seo: {
      type: DataTypes.JSON, // Storing SEO data as JSON
      allowNull: true
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });
};
