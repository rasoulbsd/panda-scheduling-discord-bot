const daysOfWeek = {
	monday: 1,
	tuesday: 2,
	wednesday: 3,
	thursday: 4,
	friday: 5,
};

const timeZoneOffsets = {
	'UTC': 0,
	'America/New_York': -4,
	'America/Chicago': -5,
	'America/Denver': -6,
	'America/Los_Angeles': -7,
	'Asia/Kolkata': 5.5,
};

function convertToUTC(hour, timezone) {
	const offset = timeZoneOffsets[timezone];
	let utcHour = hour - offset;
	let dayOffset = 0;

	// Adjust the UTC hour and calculate the day offset if necessary
	if (utcHour >= 24) {
		utcHour -= 24;
		dayOffset = 1;
	}
	else if (utcHour < 0) {
		utcHour += 24;
		dayOffset = -1;
	}

	return { utcHour, dayOffset };
}

async function createDaySlots(routine, routine_hour, timezone, routine_min = 0) {
	const { utcHour, dayOffset } = convertToUTC(routine_hour, timezone);
	return routine.split('-').map((day) => [daysOfWeek[day.toLowerCase()] + dayOffset, (new Date().getUTCFullYear()), utcHour, parseInt(routine_min)]);
}
module.exports = { createDaySlots };