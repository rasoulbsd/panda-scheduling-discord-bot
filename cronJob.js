/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-inline-comments */
const { connectToDB, getRoutines } = require('./scripts/database');
const { sendMessageAPI } = require('./utils/apiHelper');

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
	const dbo = await connectToDB();
	const date = new Date();
	const minute = date.getUTCMinutes(); // 0 to 59
	if (minute <= 1) {
		console.log('You are running between 0 and 1 minute of the hour. Please wait until the next hour to run the script.');
		console.log(`\nSleeping for ${120 - minute * 60 + date.getUTCSeconds()} seconds...\n\n`);
		await sleep(1000 * (120 - minute * 60 + date.getUTCSeconds()));
	}
	console.log('Running...\n\n');
	while (true) {
		const date = new Date();
		const day = date.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
		const hour = date.getUTCHours(); // 0 to 23
		const minute = date.getUTCMinutes(); // 0 to 59
		if (minute > 1) {
			await sleep(1000 * 60 * (57 - minute));
			continue;
		}
		const channel_routine = await getRoutines(dbo, day, hour); // Each channel can have only one routine at this time and day
		console.log(`Day: ${day} - Hour: ${hour} - Routines: ${channel_routine.length}\n`);
		for (routine of channel_routine) {
			try {
				console.log('Sending message!');
				await sendMessageAPI(routine);
			}
			catch (e) {
				console.log(e);
			}
		}
		await sleep(1000 * 60 * 2);
	}
})();
