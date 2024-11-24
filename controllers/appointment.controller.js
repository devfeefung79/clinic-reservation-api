const UserModel = require('../models/user.model');
const AppointmentModel  = require('../models/appointment.model');
const AvailableSlotModel = require('../models/availableSlot.model');

// Find available slots for a specific doctor
exports.findAvailableSlotsByDoctor = async (req, res) => {
  try {
    const doctorUserId = req.params.doctorUserId;
    const doctor = await UserModel.findByPk(doctorUserId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    } else if (doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'User is not a doctor' });
    } else {
      const availableSlots = await AvailableSlotModel.findAll({
        where: { doctor_user_id: doctorUserId }
      });
      res.json(availableSlots);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Availability Slot
exports.updateAvailableSlot = async (req, res) => {
  try {
    const slotId = req.params.id;
    const { is_booked } = req.body;

    const availableSlot = await AvailableSlotModel.findByPk(slotId);
    if (!availableSlot) {
      return res.status(404).json({ message: 'Available slot not found' });
    }

    availableSlot.is_booked = is_booked;
    await availableSlot.save();

    res.json({
      message: 'Available slot updated successfully',
      availableSlot
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Create a new appointment
 *
 * This API endpoint creates a new appointment with the given doctor, patient,
 * date, start time, and end time.
 *
 * @param {object} req.body
 * @param {number} req.body.doctorUserId - The ID of the doctor for the appointment
 * @param {number} req.body.patientUserId - The ID of the patient for the appointment
 * @param {string} req.body.date - The date of the appointment in the format 'YYYY-MM-DD'
 * @param {string} req.body.startTime - The start time of the appointment in the format 'HH:MM'
 * @param {string} req.body.endTime - The end time of the appointment in the format 'HH:MM'
 *
 * @returns {object} The newly created appointment
 *
 * @throws {Error} If the doctor or patient is not found
 */
exports.createAppointment = async (req, res) => {
  try {
    const { doctorUserId, patientUserId, date, startTime, endTime } = req.body;

    const doctor = await UserModel.findByPk(doctorUserId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const patient = await UserModel.findByPk(patientUserId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newAppointment = await AppointmentModel.create({
      doctor_user_id: doctorUserId,
      patient_user_id: patientUserId,
      appointment_date: date,
      start_time: startTime,
      end_time: endTime
    });

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: newAppointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @function getAppointmentsByDoctorId
 * @description Retrieves all appointments for a doctor
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @returns {Promise<Response>} The response with the appointments for the doctor
 *
 * @throws {Error} If the doctor is not found
 */
exports.getAppointmentsByDoctorId = async (req, res) => {
  try {
    const doctorUserId = req.params.id;
    const appointments = await AppointmentModel.findAll({
      where: { doctor_user_id: doctorUserId },
      include: [
        { model: UserModel, as: 'Doctor', attributes: ['first_name', 'last_name'] },
        { model: UserModel, as: 'Patient', attributes: ['first_name', 'last_name'] }
      ]
    });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @function getAppointmentsByPatientId
 * @description Retrieves all appointments for a patient
 * @param {Request} req - The Express request object
 * @param {Response} res - The Express response object
 * @returns {Promise<Response>} The response with the appointments for the patient
 *
 * @throws {Error} If the patient is not found
 */
exports.getAppointmentsByPatientId = async (req, res) => {
  try {
    const patientUserId = req.params.id;
    const appointments = await AppointmentModel.findAll({
      where: { patient_user_id: patientUserId },
      include: [
        { model: UserModel, as: 'Doctor', attributes: ['first_name', 'last_name'] },
        { model: UserModel, as: 'Patient', attributes: ['first_name', 'last_name'] }
      ]
    });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @function getAppointmentById
 * @description Retrieves an appointment by its ID, including doctor and patient details.
 * @param {Request} req - The Express request object with appointment ID as a parameter.
 * @param {Response} res - The Express response object used to return the appointment details or an error message.
 * @returns {Promise<Response>} The response containing the appointment details or an error message.
 *
 * @throws {Error} If the appointment is not found or if there's an internal server error.
 */
exports.getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await AppointmentModel.findByPk(appointmentId, {
      include: [
        { model: UserModel, as: 'Doctor', attributes: ['first_name', 'last_name'] },
        { model: UserModel, as: 'Patient', attributes: ['first_name', 'last_name'] }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @function updateAppointment
 * @description Updates an existing appointment with a new status.
 * @param {Request} req - The Express request object with appointment ID as a parameter and the updated status.
 * @param {Response} res - The Express response object used to return the updated appointment details or an error message.
 * @returns {Promise<Response>} The response containing the updated appointment details or an error message.
 *
 * @throws {Error} If the appointment is not found or if there's an internal server error.
 */
exports.updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;

    const appointment = await AppointmentModel.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update appointment details
    appointment.status = status || appointment.status;
    await appointment.save();

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

