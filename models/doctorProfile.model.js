const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); 
const User = require('./user.model');

const Doctor = sequelize.define('DoctorProfile', {
  doctor_profile_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  doctor_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'user_id'
    }
  },
  specialization: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'doctor_profiles',
  timestamps: false 
}); 

// Define associations
Doctor.belongsTo(User, { foreignKey: 'doctor_user_id' });
User.hasOne(Doctor, { foreignKey: 'doctor_user_id' });

module.exports = Doctor;
