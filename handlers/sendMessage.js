const { Client, GatewayIntentBits } = require('discord.js');
const { monthNames } = require('../utils/format');

const sendMessageHandler = async (
	req, res, client,
) => {
	const routine = req.body;

	// if (!routine || !routine.response_url) {
	if (!routine) {
		return 	res.status(400).send('No data or message provided');
	}

	const guild = routine.discord.guild;
	// const member = routine.member;
	const channelId = routine.discord.channelId;

	// if (!guild || !member) {
	if (!guild) {
		return 	res.status(403).send('DM_ERROR');
	}

	try {
		const channel = client.channels.cache.get(channelId);

		if (channel) {
			const thread = await channel.threads.create({
				name: monthNames[new Date().getUTCMonth()] + ' ' + routine.name,
				autoArchiveDuration: 1440,
				reason: 'Routine',
			});
			await thread.send(routine.threadContent);
		}
		else {
			console.error('Channel not found or not a text channel.');
		}

		return 	res.status(200).send('Ok');
	}
	catch (e) {
		console.error(`(panda) ${e.message}`);
		return res.status(500).send('Error in creating the thread');
	}
};

module.exports = { sendMessageHandler };