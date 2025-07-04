const mockNotification = {
    notifications: [
      {
        id: '1',
        userId: '123',
        message: 'Your appointment is confirmed for July 4, 2025, at 09:00 AM.',
        type: 'appointment_confirmation',
        createdAt: new Date(),
      },
      {
        id: '2',
        userId: '123',
        message: 'Reminder: Your appointment is tomorrow at 09:00 AM.',
        type: 'appointment_reminder',
        createdAt: new Date(),
      },
      {
        id: '3',
        userId: '456',
        message: 'Your schedule has been updated.',
        type: 'schedule_update',
        createdAt: new Date(),
      },
    ],
    createNotification: (userId, message, type) => {
      const newNotification = {
        id: (mockNotification.notifications.length + 1).toString(),
        userId,
        message,
        type,
        createdAt: new Date(),
      };
      mockNotification.notifications.push(newNotification);
      return newNotification;
    },
    getNotificationsByUserId: (userId) => {
      return mockNotification.notifications.filter(notification => notification.userId === userId);
    },
  };
  
  module.exports = mockNotification;