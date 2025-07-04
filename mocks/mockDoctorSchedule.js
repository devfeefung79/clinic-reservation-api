const mockDoctorSchedule = [
    {
      doctorId: '123',
      schedule: [
        {
          date: '2025-07-04',
          slots: ['09:00', '10:00', '11:00'],
        },
        {
          date: '2025-07-05',
          slots: ['09:00', '10:00'],
        },
      ],
    },
    {
      doctorId: '456',
      schedule: [
        {
          date: '2025-07-06',
          slots: ['10:00', '11:00', '12:00'],
        },
        {
          date: '2025-07-07',
          slots: ['09:00', '10:00'],
        },
      ],
    },
  ];
  
  module.exports = mockDoctorSchedule;