const AvailableSlotsModel = require('../models/availableSlot.model');
const DoctorScheduleModel = require('../models/doctorSchedule.model');

const { format, addMinutes, parse, isBefore, eachDayOfInterval, parseISO, getDay } = require('date-fns');

/**
 * Persists available slots for doctors between a given start and end date.
 *
 * This function retrieves doctor schedules grouped by day of the week and 
 * generates available slots for each day within the specified date interval. 
 * The generated slots are then stored in the database.
 *
 * @param {string} startDate - The start date of the interval in 'YYYY-MM-DD' format.
 * @param {string} endDate - The end date of the interval in 'YYYY-MM-DD' format.
 *
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 *
 * @throws {Error} If there is an issue with persisting the available slots.
 */
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

/**
 * Generates a list of time slots between the specified start and end times.
 * 
 * @param {string} startTime - The start time in 'HH:mm:ss' format.
 * @param {string} endTime - The end time in 'HH:mm:ss' format.
 * @param {number} intervalMinutes - The interval in minutes between each time slot.
 * @returns {Array<Object>} An array of objects where each object represents a time slot with 
 *                          'startTime' and 'endTime' properties in 'HH:mm:ss' format.
 */
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
  /**
   * Retrieves all doctor schedules grouped by day of week.
   * @returns {Object<string, DoctorScheduleModel[]>} An object with day of week as key and an array of
   * DoctorScheduleModel as value.
   * @private
   */
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


