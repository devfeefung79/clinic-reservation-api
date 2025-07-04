const doctorScheduleController = require('../controllers/doctorSchedule.controller');
const DoctorProfileModel = require('../models/doctorProfile.model');
const DoctorScheduleModel = require('../models/doctorSchedule.model');

jest.mock('../models/doctorProfile.model');
jest.mock('../models/doctorSchedule.model');

describe('doctorSchedule.controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createDoctorSchedule', () => {
    it('should create a doctor schedule successfully', async () => {
      req.body = { doctorId: 1, dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' };
      DoctorProfileModel.findByPk.mockResolvedValue({ id: 1 });
      DoctorScheduleModel.create.mockResolvedValue({ id: 2 });

      await doctorScheduleController.createDoctorSchedule(req, res);

      expect(DoctorProfileModel.findByPk).toHaveBeenCalledWith(1);
      expect(DoctorScheduleModel.create).toHaveBeenCalledWith({
        doctor_id: 1,
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '17:00'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Doctor schedule created successfully',
        schedule: { id: 2 }
      });
    });

    it('should return 404 if doctor not found', async () => {
      req.body = { doctorId: 1 };
      DoctorProfileModel.findByPk.mockResolvedValue(null);

      await doctorScheduleController.createDoctorSchedule(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Doctor not found' });
    });

    it('should handle errors', async () => {
      DoctorProfileModel.findByPk.mockRejectedValue(new Error('DB error'));

      await doctorScheduleController.createDoctorSchedule(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getSchedulesByDoctorId', () => {
    it('should return schedules for a doctor', async () => {
      req.params.doctorId = 1;
      DoctorScheduleModel.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

      await doctorScheduleController.getSchedulesByDoctorId(req, res);

      expect(DoctorScheduleModel.findAll).toHaveBeenCalledWith({ where: { doctor_id: 1 } });
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    });

    it('should handle errors', async () => {
      DoctorScheduleModel.findAll.mockRejectedValue(new Error('DB error'));

      await doctorScheduleController.getSchedulesByDoctorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getScheduleById', () => {
    it('should return a schedule by id', async () => {
      req.params.id = 1;
      DoctorScheduleModel.findByPk.mockResolvedValue({ id: 1 });

      await doctorScheduleController.getScheduleById(req, res);

      expect(DoctorScheduleModel.findByPk).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return 404 if schedule not found', async () => {
      req.params.id = 1;
      DoctorScheduleModel.findByPk.mockResolvedValue(null);

      await doctorScheduleController.getScheduleById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Schedule not found' });
    });

    it('should handle errors', async () => {
      DoctorScheduleModel.findByPk.mockRejectedValue(new Error('DB error'));

      await doctorScheduleController.getScheduleById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('updateDoctorSchedule', () => {
    it('should update a doctor schedule successfully', async () => {
      req.params.id = 1;
      req.body = { dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '18:00' };
      const saveMock = jest.fn();
      const schedule = {
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '17:00',
        save: saveMock
      };
      DoctorScheduleModel.findByPk.mockResolvedValue(schedule);

      await doctorScheduleController.updateDoctorSchedule(req, res);

      expect(schedule.day_of_week).toBe('Tuesday');
      expect(schedule.start_time).toBe('10:00');
      expect(schedule.end_time).toBe('18:00');
      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Doctor schedule updated successfully',
        schedule
      });
    });

    it('should return 404 if schedule not found', async () => {
      req.params.id = 1;
      DoctorScheduleModel.findByPk.mockResolvedValue(null);

      await doctorScheduleController.updateDoctorSchedule(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Schedule not found' });
    });

    it('should handle errors', async () => {
      DoctorScheduleModel.findByPk.mockRejectedValue(new Error('DB error'));

      await doctorScheduleController.updateDoctorSchedule(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('deleteDoctorSchedule', () => {
    it('should delete a doctor schedule successfully', async () => {
      req.params.id = 1;
      const destroyMock = jest.fn();
      DoctorScheduleModel.findByPk.mockResolvedValue({ destroy: destroyMock });

      await doctorScheduleController.deleteDoctorSchedule(req, res);

      expect(destroyMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: 'Doctor schedule deleted successfully' });
    });

    it('should return 404 if schedule not found', async () => {
      req.params.id = 1;
      DoctorScheduleModel.findByPk.mockResolvedValue(null);

      await doctorScheduleController.deleteDoctorSchedule(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Schedule not found' });
    });

    it('should handle errors', async () => {
      DoctorScheduleModel.findByPk.mockRejectedValue(new Error('DB error'));

      await doctorScheduleController.deleteDoctorSchedule(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});