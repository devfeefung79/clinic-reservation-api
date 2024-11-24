// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Load Swagger UI
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cron = require('node-cron');

// Import services
const { persistDoctorAvailableSlots } = require('./services/availableSlots.service');

// Import routes
const userRouter = require('./routes/user.route');
const doctorProfileRouter = require('./routes/doctorProfile.route');
const doctorScheduleRouter = require('./routes/doctorSchedule.route');
const appointmentRouter = require('./routes/appointment.route');
const notificationRouter = require('./routes/notification.route');

// Initialize the Express application
const app = express();

// Check for essential environment variables
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  console.error('Missing JWT_SECRET environment variable');
  process.exit(1); 
}

// Set up Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Route setup
app.use('/api/v1/user', userRouter);
app.use('/api/v1/doctor_profile', doctorProfileRouter);
app.use('/api/v1/doctor_schedule', doctorScheduleRouter);
app.use('/api/v1/appointment', appointmentRouter);
app.use('/api/v1/notification', notificationRouter);

// Schedule cron jobs
cron.schedule('0 0 * * *', () => {
  console.log('Running a task every day at midnight');
  persistDoctorAvailableSlots(process.env.SLOT_GENERATION_START_DATE, process.env.SLOT_GENERATION_END_DATE);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
