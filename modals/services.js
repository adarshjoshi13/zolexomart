const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('services', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    serviceName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subImage: {
      type: DataTypes.STRING,
      allowNull: true // Can be nullable if not every service has a subImage
    },
    mainImage: {
      type: DataTypes.STRING,
      allowNull: true // Can be nullable if not every service has a mainImage
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1 // Default to 1 (active)
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Ensure each service code is unique
    }
  });
};
