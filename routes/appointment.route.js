const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { authenticateJWT } = require('../middlewares/jwtAuth');

router.get('/availability/doctor/:id', authenticateJWT, appointmentController.findAvailableSlotsByDoctor);
router.put('/availability/:id', authenticateJWT, appointmentController.updateAvailableSlot);

/**
 * @swagger
 * /api/v1/appointment/add:
 *   post:
 *     summary: Add a new appointment
 *     tags: [Appointment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *               doctor_id:
 *                 type: integer
 *               date:
 *                 type: string
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointment_id:
 *                   type: integer
 */
router.post('/add', authenticateJWT, appointmentController.createAppointment);

/**
 * @swagger
 * /api/v1/appointment/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Appointment found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointment_id:
 *                   type: integer
 *                 patient_id:
 *                   type: integer
 *                 doctor_id:
 *                   type: integer
 *                 date:
 *                   type: string
 *                 start_time:
 *                   type: string
 *                 end_time:
 *                   type: string
 */
router.get('/:id', authenticateJWT, appointmentController.getAppointmentById);

/**
 * @swagger
 * /api/v1/appointment/doctor/{id}:
 *   get:
 *     summary: Get appointments by doctor ID
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Appointments found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *               example:
 *                 - appointment_id: 1
 *                   patient_id: 1
 *                   doctor_id: 1
 *                   date: 2023-08-01
 *                   start_time: 10:00
 *                   end_time: 12:00
 */
router.get('/doctor/:id', authenticateJWT, appointmentController.getAppointmentsByDoctorId);

/**
 * @swagger
 * /api/v1/appointment/patient/{id}:
 *   get:
 *     summary: Get appointments by patient ID
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Appointments found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *               example:
 *                 - appointment_id: 1
 *                   patient_id: 1
 *                   doctor_id: 1
 *                   date: 2023-08-01
 *                   start_time: 10:00
 *                   end_time: 12:00
*/
router.get('/patient/:id', authenticateJWT, appointmentController.getAppointmentsByPatientId);

/**
 * @swagger
 * /api/v1/appointment/{id}:
 *   put:
 *     summary: Update an appointment by ID
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient_id:
 *                 type: integer
 *               doctor_id:
 *                 type: integer
 *               date:
 *                 type: string
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *     responses:
 *       200:     
 *         description: Appointment updated successfully
 */
router.put('/:id', authenticateJWT, appointmentController.updateAppointment);

module.exports = router;
