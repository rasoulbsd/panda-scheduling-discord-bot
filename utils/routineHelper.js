const daysOfWeek = {
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
};

async function createDaySlots(routine, routine_hour, routine_min = 0) {
	return routine.split('-').map((day) => [daysOfWeek[day.toLowerCase()], (new Date().getUTCFullYear()), parseInt(routine_hour), parseInt(routine_min)]);
}
module.exports = { createDaySlots };