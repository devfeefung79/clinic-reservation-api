const UserModel = require('../models/user.model'); 
const DoctorProfileModel = require('../models/doctorProfile.model');

/**
 * Creates a doctor profile.
 * 
 * @param {Object} req - The request object
 * @param {Object} req.body - The request body
 * @param {number} req.body.doctorUserId - The ID of the doctor user 
 * @param {string} [req.body.specialization] - The doctor's specialization
 * @param {string} [req.body.bio] - The doctor's bio
 * 
 * @param {Object} res - The response object
 * 
 * @returns {Promise<void>}
 */
exports.createDoctorProfile = async (req, res) => {
  try {
    const { doctorUserId, specialization, bio } = req.body;

    const user = await UserModel.findByPk(doctorUserId);
    if (!user || user.role !== 'doctor') {
      return res.status(404).json({ message: 'User not found or is not a doctor' });
    }

    const newDoctor = await DoctorProfileModel.create({
      doctor_user_id: doctorUserId,
      specialization,
      bio
    });

    res.status(201).json({
      message: 'Doctor profile created successfully',
      doctor: newDoctor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Retrieves all doctor profiles.
 * 
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * 
 * @returns {Promise<Response>} The response with a list of doctor profiles or an error message.
 */
exports.getAllDoctorProfiles = async (req, res) => {
  try {
    const doctorProfiles = await DoctorProfileModel.findAll({
      include: [{ model: UserModel, attributes: ['first_name', 'last_name', 'email'] }]
    });

    res.json(doctorProfiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Retrieves a doctor profile by ID.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} The response with the doctor profile's details or an error message.
 */
exports.getDoctorProfileById = async (req, res) => {
  try {
    const doctorProfileId = req.params.id;
    const doctorProfile = await DoctorProfileModel.findByPk(doctorProfileId, {
      include: [{ model: UserModel, attributes: ['first_name', 'last_name', 'email'] }]
    });

    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctorProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
   * Updates a doctor profile.
   * 
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * 
   * @property {string} req.body.specialization - The doctor's specialization
   * @property {string} req.body.bio - The doctor's bio
   * 
   * @returns {Promise<void>}
   */
exports.updateDoctorProfile = async (req, res) => {
  try {
    const profileId = req.params.id;
    const { specialization, bio } = req.body;

    const doctorProfile = await DoctorProfileModel.findByPk(profileId);
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    doctorProfile.specialization = specialization || doctorProfile.specialization;
    doctorProfile.bio = bio || doctorProfile.bio;
    await doctorProfile.save();

    res.json({
      message: 'Doctor profile updated successfully',
      doctorProfile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
   * Deletes a doctor profile with the given id.
   * 
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * 
   * @returns {Promise<void>}
   */
exports.deleteDoctorProfile = async (req, res) => {
  try {
    const profileId = req.params.id;
    const doctorProfile = await DoctorProfileModel.findByPk(profileId);

    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    await doctorProfile.destroy();
    res.status(204).json({ message: 'Doctor profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
