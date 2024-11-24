const express = require('express');
const router = express.Router();
const doctorScheduleController = require('../controllers/doctorSchedule.controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/jwtAuth');

/**
 * @swagger
 * /api/v1/doctor_schedule/add:
 *   post:
 *     summary: Add a new doctor schedule
 *     tags: [Doctor Schedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_profile_id:
 *                 type: integer
 *               day:
 *                 type: string
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor schedule added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Doctor schedule added successfully
 */
router.post('/add', authenticateJWT, authorizeRoles(['admin', 'doctor']), doctorScheduleController.createDoctorSchedule);

/**
 * @swagger
 * /api/v1/doctor_schedule/{id}:
 *   get:
 *     summary: Get a doctor schedule by ID
 *     tags: [Doctor Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor schedule found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctor_schedule_id:
 *                   type: integer
 *                 doctor_profile_id:
 *                   type: integer
 *                 day:
 *                   type: string
 *                 start_time:
 *                   type: string   
 *                 end_time:
 *                   type: string   
 */
router.get('/:id', authenticateJWT, doctorScheduleController.getScheduleById);

/**
 * @swagger
 * /api/v1/doctor_schedule/doctor/{id}:
 *   get:
 *     summary: Get doctor schedules by doctor ID
 *     tags: [Doctor Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor schedules found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DoctorSchedule'
 *               example:
 *                 - doctor_schedule_id: 1
 *                   doctor_profile_id: 1
 *                   day: Monday
 *                   start_time: 10:00
 *                   end_time: 12:00
 *                 - doctor_schedule_id: 2
 *                   doctor_profile_id: 1
 *                   day: Tuesday
 *                   start_time: 14:00
 *                   end_time: 16:00
 *                 - doctor_schedule_id: 3
 *                   doctor_profile_id: 1
 *                   day: Wednesday
 *                   start_time: 18:00
 *                   end_time: 20:00
 */
router.get('/doctor/:id', authenticateJWT, doctorScheduleController.getSchedulesByDoctorId);

/**
 * @swagger
 * /api/v1/doctor_schedule/{id}/update:
 *   put:
 *     summary: Update a doctor schedule by ID
 *     tags: [Doctor Schedule]
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
 *               day:
 *                 type: string
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string 
 */
router.put('/:id/update', authenticateJWT, authorizeRoles(['admin', 'doctor']), doctorScheduleController.updateDoctorSchedule);

/**
 * @swagger
 * /api/v1/doctor_schedule/{id}:
 *   delete:
 *     summary: Delete a doctor schedule by ID
 *     tags: [Doctor Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor schedule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Doctor schedule deleted successfully
 */
router.delete('/:id', authenticateJWT, authorizeRoles(['admin', 'doctor']), doctorScheduleController.deleteDoctorSchedule);

module.exports = router;