const sendMessageHandler = async (
	req, res
) => {
	const routine = req.body;
	console.log(req)

	if ( !routine || !routine.response_url ) {
		return 	res.status(403).send('No data or message provided');
	};

	console.log(routine.response_url)

	const guild = routine.guildl
	const member = routine.member;
	const interaction = routine.interaction;

	if (!guild || !member) {
		return 	res.status(403).send('DM_ERROR');
	}

	try {
		content = routine.threadHeading + '\n' + routine.threadContent;
		const thread = await interaction.channel.threads.create({
			name: threadHeading,
			autoArchiveDuration: 1440,
			reason: 'Routine',
		});
		await thread.send(content);

		return 	res.status(200).send('Ok');
	}
	catch (e) {
		console.error(`(panda) ${err.message}`);
		return res.status(500).send('Error in creating the thread');
	}
};

module.exports = { sendMessageHandler };