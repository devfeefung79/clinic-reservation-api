const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { authenticateJWT, authorizeRoles } = require('../middlewares/jwtAuth');

const router = express.Router();

router.post('/send', authenticateJWT, authorizeRoles('admin'), notificationController.sendNotification);

module.exports = router;
