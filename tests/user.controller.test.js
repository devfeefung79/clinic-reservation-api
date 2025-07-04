const userController = require('../controllers/user.controller');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/user.model');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            req.body = {
                username: 'testuser',
                password: 'password123',
                email: 'test@example.com',
                first_name: 'Test',
                middle_name: 'M',
                last_name: 'User',
                phone: '1234567890',
                role: 'patient'
            };
            UserModel.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedpassword');
            UserModel.create.mockResolvedValue({
                user_id: 1,
                username: 'testuser',
                email: 'test@example.com',
                role: 'patient'
            });

            await userController.register(req, res);

            expect(UserModel.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(UserModel.create).toHaveBeenCalledWith(expect.objectContaining({
                username: 'testuser',
                password_hash: 'hashedpassword'
            }));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'User registered successfully',
                user: expect.objectContaining({
                    id: 1,
                    username: 'testuser',
                    email: 'test@example.com',
                    role: 'patient'
                })
            }));
        });

        it('should return 400 if username already exists', async () => {
            req.body = { username: 'existinguser' };
            UserModel.findOne.mockResolvedValue({ username: 'existinguser' });

            await userController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Username already exists' });
        });

        it('should handle errors and return 500', async () => {
            req.body = { username: 'erroruser' };
            UserModel.findOne.mockRejectedValue(new Error('DB error'));

            await userController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('login', () => {
        it('should login successfully and return token', async () => {
            req.body = { username: 'testuser', password: 'password123' };
            UserModel.findOne.mockResolvedValue({
                user_id: 1,
                username: 'testuser',
                password_hash: 'hashedpassword',
                email: 'test@example.com',
                role: 'patient'
            });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mocktoken');
            process.env.JWT_SECRET = 'secret';

            await userController.login(req, res);

            expect(UserModel.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: 1, role: 'patient' },
                'secret',
                { expiresIn: '7d' }
            );
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Login successful',
                token: 'mocktoken',
                user: expect.objectContaining({
                    id: 1,
                    username: 'testuser',
                    email: 'test@example.com',
                    role: 'patient'
                })
            }));
        });

        it('should return 401 if user not found', async () => {
            req.body = { username: 'nouser', password: 'password' };
            UserModel.findOne.mockResolvedValue(null);

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
        });

        it('should return 401 if password is invalid', async () => {
            req.body = { username: 'testuser', password: 'wrongpass' };
            UserModel.findOne.mockResolvedValue({ password_hash: 'hashedpassword' });
            bcrypt.compare.mockResolvedValue(false);

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
        });

        it('should handle errors and return 500', async () => {
            req.body = { username: 'erroruser', password: 'pass' };
            UserModel.findOne.mockRejectedValue(new Error('DB error'));

            await userController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('getUser', () => {
        it('should return user details if found', async () => {
            req.params = { id: 1 };
            UserModel.findByPk.mockResolvedValue({
                user_id: 1,
                username: 'testuser',
                email: 'test@example.com',
                first_name: 'Test',
                last_name: 'User',
                phone: '1234567890',
                role: 'patient'
            });

            await userController.getUser(req, res);

            expect(UserModel.findByPk).toHaveBeenCalledWith(1, {
                attributes: ['user_id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role']
            });
            expect(res.json).toHaveBeenCalledWith({
                user: expect.objectContaining({
                    id: 1,
                    username: 'testuser',
                    email: 'test@example.com',
                    first_name: 'Test',
                    last_name: 'User',
                    phone: '1234567890',
                    role: 'patient'
                })
            });
        });

        it('should return 404 if user not found', async () => {
            req.params = { id: 2 };
            UserModel.findByPk.mockResolvedValue(null);

            await userController.getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should handle errors and return 500', async () => {
            req.params = { id: 3 };
            UserModel.findByPk.mockRejectedValue(new Error('DB error'));

            await userController.getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });
});