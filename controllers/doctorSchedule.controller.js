const DoctorProfileModel = require('../models/doctorProfile.model');
const DoctorScheduleModel = require('../models/doctorSchedule.model');

exports.createDoctorSchedule = async (req, res) => {
  try {
    const { doctorId, dayOfWeek, startTime, endTime } = req.body;

    const doctor = await DoctorProfileModel.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const newSchedule = await DoctorScheduleModel.create({
      doctor_id: doctorId,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime
    });

    res.status(201).json({
      message: 'Doctor schedule created successfully',
      schedule: newSchedule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getSchedulesByDoctorId = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const schedules = await DoctorScheduleModel.findAll({
      where: { doctor_id: doctorId }
    });

    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getScheduleById = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const schedule = await DoctorScheduleModel.findByPk(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateDoctorSchedule = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const { dayOfWeek, startTime, endTime } = req.body;

    const schedule = await DoctorScheduleModel.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Update schedule details
    schedule.day_of_week = dayOfWeek || schedule.day_of_week;
    schedule.start_time = startTime || schedule.start_time;
    schedule.end_time = endTime || schedule.end_time;
    await schedule.save();

    res.json({
      message: 'Doctor schedule updated successfully',
      schedule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteDoctorSchedule = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const schedule = await DoctorScheduleModel.findByPk(scheduleId);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await schedule.destroy();
    res.status(204).json({ message: 'Doctor schedule deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
