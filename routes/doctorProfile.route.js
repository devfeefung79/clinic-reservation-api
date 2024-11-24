const express = require('express');
const router = express.Router();
const doctorProfileController = require('../controllers/doctorProfile.controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/jwtAuth');

/**
 * @swagger
 * /api/v1/doctor_profile/add:
 *   post:
 *     summary: Add a new doctor profile
 *     tags: [Doctor Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               specialization:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor profile created successfully
 *         content:
 *           application/json:
 *             schema:  
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Doctor profile created successfully
 *                 doctorProfile:
 *                   type: object   
 *                   properties:
 *                     doctor_profile_id:
 *                       type: integer
 *                       example: 1
 */
router.post('/add', authenticateJWT, authorizeRoles('admin'), doctorProfileController.createDoctorProfile);

/**
 * @swagger
 * /api/v1/doctor_profile/list:
 *   get:
 *     summary: Get all doctor profiles
 *     tags: [Doctor Profile]
 *     responses:
 *       200:
 *         description: List of all doctor profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   doctor_profile_id:
 *                     type: integer
 *                     example: 1
 *                   doctor_user_id:
 *                     type: integer
 *                     example: 1
 *                   specialization:
 *                     type: string
 *                     example: Cardiologist
 *                   bio:
 *                     type: string
 *                     example: Cardiologist
 *                   first_name:
 *                     type: string
 *                     example: John
 *                   last_name:
 *                     type: string
 *                     example: Doe
 *                   email:
 *                     type: string 
 *                     example: 5Kl9V@example.com
 *                   username:
 *                     type: string
 *                     example: johndoe
 *                   created_at:
 *                     type: string
 *                     example: 2022-01-01T00:00:00.000Z
 *                   updated_at:
 *                     type: string
 *                     example: 2022-01-01T00:00:00.000Z
 */
router.get('/list', authenticateJWT, doctorProfileController.getAllDoctorProfiles);

/**
 * @swagger
 * /api/v1/doctor_profile/{id}:
 *   get:
 *     summary: Get a doctor profile by ID
 *     tags: [Doctor Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor profile found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctor_profile_id:
 *                   type: integer
 *                 doctor_user_id:
 *                   type: integer
 *                 specialization:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                 updated_at:
 *                   type: string
 */
router.get('/:id', authenticateJWT, doctorProfileController.getDoctorProfileById);

/**
 * @swagger
 * /api/v1/doctor_profile/{id}/update:
 *   put:
 *     summary: Update a doctor profile by ID
 *     tags: [Doctor Profile]
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
 *               specialization:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Doctor profile updated successfully
 *                 doctorProfile:
 *                   type: object
 *                   properties:
 *                     doctor_profile_id:
 *                       type: integer
 *                       example: 1
 */
router.put('/:id/update', authenticateJWT, authorizeRoles('admin'), doctorProfileController.updateDoctorProfile);

/**
 * @swagger
 * /api/v1/doctor_profiles/{id}:
 *   delete:
 *     summary: Delete a doctor profile by ID
 *     tags: [Doctor Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctor profile deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Doctor profile deleted successfully
 *                 doctorProfile:
 *                   type: object
 *                   properties:
 *                     doctor_profile_id:
 *                       type: integer
 *                       example: 1
 *                     doctor_user_id:
 *                       type: integer
 *                       example: 1
 *                     specialization:
 *                       type: string
 *                       example: Cardiologist
 *                     bio:
 *                       type: string
 *                       example: Cardiologist
 *                     first_name:
 *                       type: string
 *                       example: John
 *                     last_name:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: 5Kl9V@example.com
 *                     username:
 *                       type: string
 *                       example: johndoe
 */
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), doctorProfileController.deleteDoctorProfile);

module.exports = router;
