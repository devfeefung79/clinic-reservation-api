const NotificationModel = require('../models/notification.model');
const { sendNotification } = require('../controllers/notification.controller');

jest.mock('../models/notification.model');

describe('sendNotification', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                userId: 'user123',
                message: 'Test notification'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('should create a notification and return success response', async () => {
        const mockNotification = { id: 'notif1', user_id: 'user123', message: 'Test notification' };
        NotificationModel.create.mockResolvedValue(mockNotification);

        await sendNotification(req, res);

        expect(NotificationModel.create).toHaveBeenCalledWith({
            user_id: 'user123',
            message: 'Test notification'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Notification created successfully',
            notification: mockNotification
        });
    });

    it('should handle errors and return 500', async () => {
        const error = new Error('DB error');
        NotificationModel.create.mockRejectedValue(error);

        // Mock console.error to suppress error output in test
        jest.spyOn(console, 'error').mockImplementation(() => {});

        await sendNotification(req, res);

        expect(NotificationModel.create).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });

        console.error.mockRestore();
    });

    it('should use userId and message from req.body', async () => {
        req.body = { userId: 'abc', message: 'Hello' };
        const mockNotification = { id: 'notif2', user_id: 'abc', message: 'Hello' };
        NotificationModel.create.mockResolvedValue(mockNotification);

        await sendNotification(req, res);

        expect(NotificationModel.create).toHaveBeenCalledWith({
            user_id: 'abc',
            message: 'Hello'
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Notification created successfully',
            notification: mockNotification
        });
    });

    it('should handle missing userId or message gracefully', async () => {
        req.body = {};
        NotificationModel.create.mockResolvedValue({ id: 'notif3', user_id: undefined, message: undefined });

        await sendNotification(req, res);

        expect(NotificationModel.create).toHaveBeenCalledWith({
            user_id: undefined,
            message: undefined
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Notification created successfully',
            notification: { id: 'notif3', user_id: undefined, message: undefined }
        });
    });
});