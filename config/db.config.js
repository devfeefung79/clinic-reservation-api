// config/db.config.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a new Sequelize instance with connection pooling options
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // Using mysql
  port: process.env.DB_PORT,
  pool: {
    max: 10,      // Maximum number of connections in the pool
    min: 0,       // Minimum number of connections in the pool
    acquire: 30000, // Maximum time, in ms, that a connection can be idle before being released
    idle: 10000   // Maximum time, in ms, that pool will try to get connection before throwing error
  }
});

module.exports = sequelize;
