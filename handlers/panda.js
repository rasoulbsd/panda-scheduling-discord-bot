const { connectToDB, saveRoutine } = require('../scripts/database');
const { ephemeralWarning } = require('../utils/renderMessage');
const { createDaySlots } = require('../utils/routineHelper');
const { serializeObject } = require('../utils/format');

const routineHandler = async (
	client,
	interaction,
	responseUrl,
) => {
	if (!responseUrl) return;

	const { guild, member } = interaction;

	if (!guild || !member) {
		await ephemeralWarning(interaction, 'DM_ERROR');
		return;
	}

	try {
		const routineOptions = interaction.options.getString('routine');
		if (!routineOptions) {
			await ephemeralWarning(
				interaction,
				'Please select a routine',
			);
			return;
		}

		const timeOptions = interaction.options.getString('time');
		if (!timeOptions) {
			await ephemeralWarning(
				interaction,
				'Please select a time for the routine',
			);
			return;
		}

		const roleOptions = interaction.options.getString('role');

		const dbo = await connectToDB();

		try {
			// const routineInfo = await simpleRoutine(routineOptions, timeOptions);
			// ToDo:
			// const date_and_time = 'Sep 29, 2023';
			// const threadHeading = `${date_and_time} Async Daily`;

			const threadContent = 'Hey Hey, ' +
							roleOptions ? `${roleOptions},  ` : '' +
							'Please leave your updates in this thread,' +
							'\nPlease use the following template:' +
							'\n🙋‍♀️How I feel🙋‍♂️' +
							'\n-' +
							'\n-' +
							'\n👩‍💻What I\'m busy with🧑‍💻' +
							'\n-' +
							'\n-' +
							'\n🧱Blockers I\'m facing and suggestions to fix them🧱' +
							'\n-' +
							'\n-' +
							'\n🤓Final remark🤓' +
							'\n-' +
							'\n-';

			try {
				const slots = await createDaySlots(routineOptions, timeOptions);
				for (const slot of slots) {
					// await createRoutine(dbo, guild.name, {
					await saveRoutine(dbo, guild.name, interaction.channelId, {
						name: `${slot[0]}, ${slot[1]} Async Daily`,
						'date': {
							'day': slot[0],
							'year': slot[1],
							'time': slot[2],
						},
						'role': roleOptions,
						scheduler: member.id,
						threadContent,
						'discord': {
							'guild': guild,
							'server_id': guild.id,
							'channelId': interaction.channelId,
							'message': responseUrl,
						},
					});
				}
			}
			catch (e) {
				await ephemeralWarning(
					interaction,
					e,
				);
				return;
			}
			// const thread = await interaction.channel.threads.create({
			// 	name: threadHeading,
			// 	autoArchiveDuration: 1440,
			// 	reason: 'Routine',
			// });
			// await thread.send(content);

			await interaction.followUp({
				content: 'Routine scheduled successfully!',
				ephemeral: true,
			});
		}
		catch (e) {
			await ephemeralWarning(
				interaction,
				`There was an issue scheduling your routine. ${e.message}`,
			);
			return;
		}

		// }
		// catch (e) {
		// 	console.error(e)
		// 	console.log('error')
		// 	await ephemeralWarning(
		// 		interaction,
		// 		`Problem in scheduling the routine!`,
		// 	);
		// 	return;
		// }

		return;
	}
	catch (err) {
		console.error(`(panda) ${err.message}`);
		throw err;
	}
};

module.exports = { routineHandler };