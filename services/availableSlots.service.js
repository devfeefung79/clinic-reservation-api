const AvailableSlotsModel = require('../models/availableSlot.model');
const DoctorScheduleModel = require('../models/doctorSchedule.model');

const { format, addMinutes, parse, isBefore, eachDayOfInterval, parseISO, getDay } = require('date-fns');

exports.persistDoctorAvailableSlots = async (startDate, endDate) => {
  const availableSlots = [];
  const doctorSchedules = await _getDoctorSchedulesByDayOfWeek();

  // Parse the input dates if they are in string format
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  // Generate an array of dates for each day in the interval
  const dates = eachDayOfInterval({ start, end });

  // Group the doctor schedules by day of week
  const schedulesByDay = dates.reduce((schedules, date) => {
    const day = getDay(date).toString();
    const doctorSchedulesForDay = doctorSchedules[day] || [];
    schedules[day] = doctorSchedulesForDay;
    return schedules;
  }, {});

  // Loop through each date and perform an action
  await Promise.all(Object.entries(schedulesByDay).map(async ([day, doctorSchedulesForDay]) => {
    const date = dates.find(date => getDay(date).toString() === day);
    const slots = doctorSchedulesForDay.reduce((slots, schedule) => {
      const scheduleSlots = _generateTimeSlots(schedule.start_time, schedule.end_time, 30);
      return slots.concat(scheduleSlots.map(slot => ({
        doctor_user_id: schedule.doctor_user_id,
        available_date: format(date, 'yyyy-MM-dd'),
        start_time: slot.startTime,
        end_time: slot.endTime,
        is_booked: 0,
      })));
    }, []);
    availableSlots.push(...slots);
  }));

  try {
    await AvailableSlotsModel.bulkCreate(availableSlots);
  } catch (error) {
    console.error(`Error persisting available slots: ${error}`);
  }
};

const _generateTimeSlots = (startTime, endTime, intervalMinutes) => {
  const slots = [];
  const start = parse(startTime, 'HH:mm:ss', new Date());
  const end = parse(endTime, 'HH:mm:ss', new Date());
  let current = start;

  while (isBefore(current, end)) {
    const startSlot = format(current, 'HH:mm:ss');
    current = addMinutes(current, intervalMinutes);
    const endSlot = format(current, 'HH:mm:ss');
    slots.push({ startTime: startSlot, endTime: endSlot });
  }

  return slots;
};

const _getDoctorSchedulesByDayOfWeek = async () => {
  const doctorSchedules = await DoctorScheduleModel.findAll({
    order: [
      ['doctor_user_id', 'ASC']
    ]
  });

  // Use reduce to group the schedules by day of week
  return doctorSchedules.reduce((accumulator, schedule) => {
    const day = DayOfWeek[schedule.day_of_week];
    accumulator[day] = accumulator[day] || [];
    accumulator[day].push(schedule);
    return accumulator;
  }, {});
};

const DayOfWeek = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6
};


