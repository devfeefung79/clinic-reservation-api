const NotificationModel = require('../models/notification.model'); // Adjust the path based on your project structure

/**
 * Sends a notification to a user.
 *
 * @function sendNotification
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} The response with the newly created notification's details or an error message.
 */
exports.sendNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    const newNotification = await NotificationModel.create({
      user_id: userId,
      message,
    });

    res.status(201).json({
      message: 'Notification created successfully',
      notification: newNotification
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
