const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'securepassword',
    role: 'patient',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const mockUsers = [
    {
      id: 'user-123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securepassword',
      role: 'patient',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'user-124',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'securepassword',
      role: 'doctor',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  
  module.exports = {
    mockUser,
    mockUsers,
  };