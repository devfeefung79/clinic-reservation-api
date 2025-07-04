const mockDoctorProfile = {
    id: '123',
    name: 'Dr. John Doe',
    specialty: 'Cardiology',
    experience: 10,
    contact: {
      phone: '123-456-7890',
      email: 'johndoe@example.com',
    },
    availability: [
      {
        day: 'Monday',
        slots: ['09:00', '10:00', '11:00'],
      },
      {
        day: 'Tuesday',
        slots: ['10:00', '11:00', '14:00'],
      },
      {
        day: 'Wednesday',
        slots: ['09:00', '13:00'],
      },
      {
        day: 'Thursday',
        slots: ['10:00', '15:00'],
      },
      {
        day: 'Friday',
        slots: ['09:00', '11:00', '16:00'],
      },
    ],
  };
  
  module.exports = mockDoctorProfile;