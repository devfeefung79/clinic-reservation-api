const mockAppointments = [
    {
      id: '1',
      doctorId: '123',
      patientId: '456',
      date: '2025-07-04',
      time: '09:00',
      status: 'confirmed',
    },
    {
      id: '2',
      doctorId: '123',
      patientId: '789',
      date: '2025-07-04',
      time: '10:00',
      status: 'pending',
    },
    {
      id: '3',
      doctorId: '124',
      patientId: '101',
      date: '2025-07-05',
      time: '11:00',
      status: 'canceled',
    },
  ];
  
  const createAppointment = (appointment) => {
    mockAppointments.push({ id: String(mockAppointments.length + 1), ...appointment });
    return mockAppointments[mockAppointments.length - 1];
  };
  
  const getAppointmentById = (id) => {
    return mockAppointments.find(appointment => appointment.id === id);
  };
  
  const getAllAppointments = () => {
    return mockAppointments;
  };
  
  module.exports = {
    mockAppointments,
    createAppointment,
    getAppointmentById,
    getAllAppointments,
  };