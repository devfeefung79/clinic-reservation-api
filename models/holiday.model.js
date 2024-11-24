const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Holiday = sequelize.define('Holiday', {
  holiday_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true, 
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'holidays',
  timestamps: false 
});

module.exports = Holiday;
