const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const User = require('./user.model');

const DoctorSchedule = sequelize.define('DoctorSchedule', {
  schedule_id: {
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
  day_of_week: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']]
    }
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
  }
}, {
  tableName: 'doctor_schedules', 
  timestamps: false
});

DoctorSchedule.belongsTo(User, { foreignKey: 'doctor_user_id' });
User.hasMany(DoctorSchedule, { foreignKey: 'doctor_user_id' });

module.exports = DoctorSchedule;
