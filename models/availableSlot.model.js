const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');

const AvailabilitySlot = sequelize.define('AvailableSlot', {
  slot_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  doctor_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'user_id'
    }
  },
  available_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  is_booked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  tableName: 'available_slots',
  timestamps: false
});

AvailabilitySlot.belongsTo(User, { foreignKey: 'doctor_user_id' });
User.hasMany(AvailabilitySlot, { foreignKey: 'doctor_user_id' });

module.exports = AvailabilitySlot;
