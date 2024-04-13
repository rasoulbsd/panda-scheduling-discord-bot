const { connectToDB, saveRoutine } = require('../scripts/database');
const { ephemeralWarning } = require('../utils/renderMessage');
const { createDaySlots } = require('../utils/routineHelper');

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

		const timezoneOptions = interaction.options.getString('timezone');
		const timezone = timezoneOptions ? timezoneOptions : 'UTC';

		const contextOptions = interaction.options.getString('context');

		const roleOptions = interaction.options.getString('role');

		const dbo = await connectToDB();

		try {
			let threadContent = 'Hey Hey, ';
			threadContent += roleOptions ? `${roleOptions},\n` : '\n';
			if (!contextOptions) {
				threadContent += 'Please leave your updates in this thread,' +
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
			}
			else {
				threadContent += contextOptions;
			}

			try {
				const slots = await createDaySlots(routineOptions, timeOptions, timezone);
				for (const slot of slots) {
					// await createRoutine(dbo, guild.name, {
					await saveRoutine(dbo, guild.name, interaction.channelId, {
						name: `${slot[1]} Async Daily`,
						'date': {
							'day': slot[0],
							'year': slot[1],
							'hour': slot[2],
							'minute': slot[3],
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

			let routineOption_here = routineOptions;
			if (routineOptions === 'monday-tuesday-wednesday-thursday-friday') {routineOption_here = 'Everyday';}
			else if (routineOptions === 'monday-wednesday-friday') {routineOption_here = 'Even Days';}
			else if (routineOptions === 'tuesday-thursday') {
				routineOption_here = 'Odd Days';
			}

			await interaction.followUp({
				content: `Routine scheduled successfully:\n${routineOption_here} - ${timeOptions}:00 ${timezone}`,
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
		return;
	}
	catch (err) {
		console.error(`(panda) ${err.message}`);
		throw err;
	}
};

module.exports = { routineHandler };