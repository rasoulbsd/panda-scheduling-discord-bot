/* eslint-disable no-constant-condition */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-inline-comments */
const { connectToDB, getRoutines } = require('./scripts/database');
const { sendMessageAPI } = require('./utils/apiHelper');

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const DEBUGGING = false;
const CHECKING_PERIOD = (DEBUGGING) ? (1000 * 2) : (1000 * 60 * 2);

(async () => {
	const dbo = await connectToDB();
	const date = new Date();
	const minute = date.getUTCMinutes(); // 0 to 59
	if (minute <= 1 && !DEBUGGING) {
		console.log('You are running between 0 and 1 minute of the hour. Please wait until the next hour to run the script.');
		console.log(`\nSleeping for ${120 - minute * 60 + date.getUTCSeconds()} seconds...\n\n`);
		await sleep(1000 * (120 - minute * 60 + date.getUTCSeconds()));
	}
	console.log('Running...\n');
	console.log(`Debugging: ${DEBUGGING}`);
	console.log(`Checking period: ${CHECKING_PERIOD / 1000} Seconds`);
	console.log('=========================\n');

	while (true) {
		const date = new Date();
		const year = date.getFullYear();
		const day = date.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
		const hour = date.getUTCHours(); // 0 to 23
		const minute = date.getUTCMinutes(); // 0 to 59
		if (minute > 1 && !DEBUGGING) {
			await sleep(1000 * 60 * (57 - minute));
			continue;
		}
		let channel_routine = [];
		try {
			channel_routine = await getRoutines(dbo, day, year, hour); // Each channel can have only one routine at this time and day
		}
		catch (e) {
			console.log(e);
		}
		console.log(`Day: ${day} - Hour: ${hour} - Min: ${minute} - Routines: ${channel_routine?.length}`);
		// console.log(channel_routine);
		for (routine of channel_routine) {
			try {
				console.log('Sending message!');
				await sendMessageAPI(routine);
			}
			catch (e) {
				console.log(e.message);
			}
		}
		await sleep(CHECKING_PERIOD);
	}
})();
