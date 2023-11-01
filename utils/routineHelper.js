const daysOfWeek = {
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
};

async function createDaySlots(routine, routine_time) {
	// console.log(routine.split('-'))
	// console.log(routine.split('-').map((day) => daysOfWeek[day].toLowerCase()))
	return routine.split('-').map((day) => [daysOfWeek[day.toLowerCase()], (new Date().getFullYear()), parseInt(routine_time)]);
}
module.exports = { createDaySlots };