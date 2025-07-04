const doctorProfileController = require('../controllers/doctorProfile.controller');
const UserModel = require('../models/user.model');
const DoctorProfileModel = require('../models/doctorProfile.model');

jest.mock('../models/user.model');
jest.mock('../models/doctorProfile.model');

describe('doctorProfile.controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('createDoctorProfile', () => {
        it('should create a doctor profile successfully', async () => {
            req.body = { doctorUserId: 1, specialization: 'Cardiology', bio: 'Bio' };
            UserModel.findByPk.mockResolvedValue({ id: 1, role: 'doctor' });
            DoctorProfileModel.create.mockResolvedValue({ id: 2, doctor_user_id: 1, specialization: 'Cardiology', bio: 'Bio' });

            await doctorProfileController.createDoctorProfile(req, res);

            expect(UserModel.findByPk).toHaveBeenCalledWith(1);
            expect(DoctorProfileModel.create).toHaveBeenCalledWith({
                doctor_user_id: 1,
                specialization: 'Cardiology',
                bio: 'Bio'
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Doctor profile created successfully',
                doctor: expect.any(Object)
            }));
        });

        it('should return 404 if user not found or not a doctor', async () => {
            req.body = { doctorUserId: 1 };
            UserModel.findByPk.mockResolvedValue(null);

            await doctorProfileController.createDoctorProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found or is not a doctor' });
        });

        it('should handle errors', async () => {
            req.body = { doctorUserId: 1 };
            UserModel.findByPk.mockRejectedValue(new Error('DB error'));

            await doctorProfileController.createDoctorProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('getAllDoctorProfiles', () => {
        it('should return all doctor profiles', async () => {
            const profiles = [{ id: 1 }, { id: 2 }];
            DoctorProfileModel.findAll.mockResolvedValue(profiles);

            await doctorProfileController.getAllDoctorProfiles(req, res);

            expect(DoctorProfileModel.findAll).toHaveBeenCalledWith({
                include: [{ model: UserModel, attributes: ['first_name', 'last_name', 'email'] }]
            });
            expect(res.json).toHaveBeenCalledWith(profiles);
        });

        it('should handle errors', async () => {
            DoctorProfileModel.findAll.mockRejectedValue(new Error('DB error'));

            await doctorProfileController.getAllDoctorProfiles(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('getDoctorProfileById', () => {
        it('should return doctor profile by id', async () => {
            req.params.id = 1;
            const profile = { id: 1 };
            DoctorProfileModel.findByPk.mockResolvedValue(profile);

            await doctorProfileController.getDoctorProfileById(req, res);

            expect(DoctorProfileModel.findByPk).toHaveBeenCalledWith(1, {
                include: [{ model: UserModel, attributes: ['first_name', 'last_name', 'email'] }]
            });
            expect(res.json).toHaveBeenCalledWith(profile);
        });

        it('should return 404 if doctor profile not found', async () => {
            req.params.id = 1;
            DoctorProfileModel.findByPk.mockResolvedValue(null);

            await doctorProfileController.getDoctorProfileById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Doctor not found' });
        });

        it('should handle errors', async () => {
            req.params.id = 1;
            DoctorProfileModel.findByPk.mockRejectedValue(new Error('DB error'));

            await doctorProfileController.getDoctorProfileById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('updateDoctorProfile', () => {
        it('should update doctor profile successfully', async () => {
            req.params.id = 1;
            req.body = { specialization: 'Dermatology', bio: 'Updated bio' };
            const saveMock = jest.fn();
            const doctorProfile = { specialization: 'Old', bio: 'Old', save: saveMock };
            DoctorProfileModel.findByPk.mockResolvedValue(doctorProfile);

            await doctorProfileController.updateDoctorProfile(req, res);

            expect(doctorProfile.specialization).toBe('Dermatology');
            expect(doctorProfile.bio).toBe('Updated bio');
            expect(saveMock).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                message: 'Doctor profile updated successfully',
                doctorProfile
            });
        });

        it('should return 404 if doctor profile not found', async () => {
            req.params.id = 1;
            DoctorProfileModel.findByPk.mockResolvedValue(null);

            await doctorProfileController.updateDoctorProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Doctor profile not found' });
        });

        it('should handle errors', async () => {
            req.params.id = 1;
            DoctorProfileModel.findByPk.mockRejectedValue(new Error('DB error'));

            await doctorProfileController.updateDoctorProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('deleteDoctorProfile', () => {
        it('should delete doctor profile successfully', async () => {
            req.params.id = 1;
            const destroyMock = jest.fn();
            DoctorProfileModel.findByPk.mockResolvedValue({ destroy: destroyMock });

            await doctorProfileController.deleteDoctorProfile(req, res);

            expect(destroyMock).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith({ message: 'Doctor profile deleted successfully' });
        });

        it('should return 404 if doctor profile not found', async () => {
            req.params.id = 1;
            DoctorProfileModel.findByPk.mockResolvedValue(null);

            await doctorProfileController.deleteDoctorProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Doctor profile not found' });
        });

        it('should handle errors', async () => {
            req.params.id = 1;
            DoctorProfileModel.findByPk.mockRejectedValue(new Error('DB error'));

            await doctorProfileController.deleteDoctorProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });
});