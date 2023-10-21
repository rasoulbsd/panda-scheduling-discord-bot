const parseRoutines = (routines) => {
	return {
		validRoutineIds: routines?.match(/<@!?(\d+)>/g),
		undefinedRoutines: routines?.match(/[^<]@(\w+)/gi),
		roleMentions: routines?.match(/<@&(\d+)>/g),
	};
};

module.exports = { parseRoutines };
