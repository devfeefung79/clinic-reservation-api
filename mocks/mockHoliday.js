const holidays = [
    {
      id: 1,
      date: '2025-01-01',
      name: 'New Year\'s Day',
    },
    {
      id: 2,
      date: '2025-12-25',
      name: 'Christmas Day',
    },
    {
      id: 3,
      date: '2025-07-04',
      name: 'Independence Day',
    },
  ];
  
  const getHolidays = () => {
    return holidays;
  };
  
  const isHoliday = (date) => {
    return holidays.some(holiday => holiday.date === date);
  };
  
  module.exports = {
    getHolidays,
    isHoliday,
  };