const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');

const Appointment = sequelize.define('Appointment', {
  appointment_id: {
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
  patient_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
}, {
  tableName: 'appointments',
  timestamps: false
});

Appointment.belongsTo(User, { as: 'Doctor', foreignKey: 'doctor_user_id' });
Appointment.belongsTo(User, { as: 'Patient', foreignKey: 'patient_user_id' });

module.exports = Appointment;
