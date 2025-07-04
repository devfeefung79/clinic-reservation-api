const appointmentController = require('../controllers/appointment.controller');
const UserModel = require('../models/user.model');
const AppointmentModel = require('../models/appointment.model');
const AvailableSlotModel = require('../models/availableSlot.model');

jest.mock('../models/user.model');
jest.mock('../models/appointment.model');
jest.mock('../models/availableSlot.model');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Appointment Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAvailableSlotsByDoctor', () => {
        it('should return 404 if doctor not found', async () => {
            UserModel.findByPk.mockResolvedValue(null);
            const req = { params: { doctorUserId: 1 } };
            const res = mockRes();

            await appointmentController.findAvailableSlotsByDoctor(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Doctor not found' });
        });

        it('should return 400 if user is not a doctor', async () => {
            UserModel.findByPk.mockResolvedValue({ role: 'patient' });
            const req = { params: { doctorUserId: 2 } };
            const res = mockRes();

            await appointmentController.findAvailableSlotsByDoctor(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User is not a doctor' });
        });

        it('should return available slots for doctor', async () => {
            UserModel.findByPk.mockResolvedValue({ role: 'doctor' });
            const slots = [{ id: 1 }, { id: 2 }];
            AvailableSlotModel.findAll.mockResolvedValue(slots);
            const req = { params: { doctorUserId: 3 } };
            const res = mockRes();

            await appointmentController.findAvailableSlotsByDoctor(req, res);

            expect(res.json).toHaveBeenCalledWith(slots);
        });
    });

    describe('updateAvailableSlot', () => {
        it('should return 404 if slot not found', async () => {
            AvailableSlotModel.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 }, body: { is_booked: true } };
            const res = mockRes();

            await appointmentController.updateAvailableSlot(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Available slot not found' });
        });

        it('should update slot and return success', async () => {
            const save = jest.fn();
            const slot = { is_booked: false, save };
            AvailableSlotModel.findByPk.mockResolvedValue(slot);
            const req = { params: { id: 2 }, body: { is_booked: true } };
            const res = mockRes();

            await appointmentController.updateAvailableSlot(req, res);

            expect(slot.is_booked).toBe(true);
            expect(save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                message: 'Available slot updated successfully',
                availableSlot: slot
            });
        });
    });

    describe('createAppointment', () => {
        it('should return 404 if doctor not found', async () => {
            UserModel.findByPk.mockResolvedValueOnce(null);
            const req = { body: { doctorUserId: 1, patientUserId: 2, date: '2024-01-01', startTime: '10:00', endTime: '11:00' } };
            const res = mockRes();

            await appointmentController.createAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Doctor not found' });
        });

        it('should return 404 if patient not found', async () => {
            UserModel.findByPk.mockResolvedValueOnce({ id: 1, role: 'doctor' });
            UserModel.findByPk.mockResolvedValueOnce(null);
            const req = { body: { doctorUserId: 1, patientUserId: 2, date: '2024-01-01', startTime: '10:00', endTime: '11:00' } };
            const res = mockRes();

            await appointmentController.createAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Patient not found' });
        });

        it('should create appointment and return 201', async () => {
            UserModel.findByPk.mockResolvedValue({ id: 1, role: 'doctor' });
            UserModel.findByPk.mockResolvedValueOnce({ id: 1, role: 'doctor' });
            UserModel.findByPk.mockResolvedValueOnce({ id: 2, role: 'patient' });
            const appointment = { id: 1 };
            AppointmentModel.create.mockResolvedValue(appointment);
            const req = { body: { doctorUserId: 1, patientUserId: 2, date: '2024-01-01', startTime: '10:00', endTime: '11:00' } };
            const res = mockRes();

            await appointmentController.createAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Appointment created successfully',
                appointment
            });
        });
    });

    describe('getAppointmentsByDoctorId', () => {
        it('should return appointments for doctor', async () => {
            const appointments = [{ id: 1 }];
            AppointmentModel.findAll.mockResolvedValue(appointments);
            const req = { params: { id: 1 } };
            const res = mockRes();

            await appointmentController.getAppointmentsByDoctorId(req, res);

            expect(res.json).toHaveBeenCalledWith(appointments);
        });
    });

    describe('getAppointmentsByPatientId', () => {
        it('should return appointments for patient', async () => {
            const appointments = [{ id: 2 }];
            AppointmentModel.findAll.mockResolvedValue(appointments);
            const req = { params: { id: 2 } };
            const res = mockRes();

            await appointmentController.getAppointmentsByPatientId(req, res);

            expect(res.json).toHaveBeenCalledWith(appointments);
        });
    });

    describe('getAppointmentById', () => {
        it('should return 404 if appointment not found', async () => {
            AppointmentModel.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 } };
            const res = mockRes();

            await appointmentController.getAppointmentById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Appointment not found' });
        });

        it('should return appointment if found', async () => {
            const appointment = { id: 1 };
            AppointmentModel.findByPk.mockResolvedValue(appointment);
            const req = { params: { id: 1 } };
            const res = mockRes();

            await appointmentController.getAppointmentById(req, res);

            expect(res.json).toHaveBeenCalledWith(appointment);
        });
    });

    describe('updateAppointment', () => {
        it('should return 404 if appointment not found', async () => {
            AppointmentModel.findByPk.mockResolvedValue(null);
            const req = { params: { id: 1 }, body: { status: 'completed' } };
            const res = mockRes();

            await appointmentController.updateAppointment(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Appointment not found' });
        });

        it('should update appointment status and return success', async () => {
            const save = jest.fn();
            const appointment = { status: 'pending', save };
            AppointmentModel.findByPk.mockResolvedValue(appointment);
            const req = { params: { id: 2 }, body: { status: 'completed' } };
            const res = mockRes();

            await appointmentController.updateAppointment(req, res);

            expect(appointment.status).toBe('completed');
            expect(save).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                message: 'Appointment updated successfully',
                appointment
            });
        });
    });
});