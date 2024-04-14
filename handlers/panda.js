const { connectToDB, saveRoutine, saveRoutineSlot, getRoutinesByChannel, deleteRoutine, updateRoutine } = require('../scripts/database');
const { ephemeralWarning } = require('../utils/renderMessage');
const { createDaySlots } = require('../utils/routineHelper');
const { getFriendlyRoutineName } = require('../utils/format');

async function initialCheck(interaction, responseUrl) {
	if (!responseUrl) {
		return;
	}

	const { guild, member } = interaction;
	if (!guild || !member) {
		await ephemeralWarning(interaction, 'This command can\'t be used in DMs.');
		throw new Error('This command can\'t be used in DMs.');
	}

	return guild;
}

const listHandler = async (client, interaction, responseUrl) => {
	await initialCheck(interaction, responseUrl);
	const { guild } = interaction;

	const dbo = await connectToDB();

	let messageContent = '';
	try {
		const routines = await getRoutinesByChannel(dbo, guild.name.replaceAll(' ', '-'), interaction.channelId);
		if (routines.length > 0) {
			messageContent = routines;
		}
		else {
			messageContent = 'No routines found in this channel.';
		}
	}
	catch (err) {
		console.error('Error processing routine:', err);
		messageContent = `An error occurred: ${err.message}`;
	}
	finally {
		await dbo.close();
	}

	await interaction.reply({ content: messageContent, ephemeral: true });
};

const manageRoutineHandler = async (client, interaction, responseUrl) => {
	await initialCheck(interaction, responseUrl);
	const { guild } = interaction;

	const actionOptions = interaction.options.getString('action');
	const routineIdOptions = interaction.options.getString('routine_id');

	if (!actionOptions || !routineIdOptions) {
		await ephemeralWarning(interaction, 'Please ensure all required fields are selected.');
		return;
	}

	const dbo = await connectToDB();
	let messageContent = '';

	const listOptions = interaction.options.getString('list');
	console.log(listOptions);

	try {
		if (actionOptions === 'list') {
			const compositeIds = await getRoutinesByChannel(dbo, guild.name.replaceAll(' ', '-'), interaction.channelId);
			if (compositeIds.length > 0) {
				messageContent = 'List of routine IDs:\n' + compositeIds.join('\n');
			}
			else {
				messageContent = 'No routines found in this channel.';
			}
		}
		else if (actionOptions === 'delete') {
			const result = await deleteRoutine(dbo, guild.name.replaceAll(' ', '-'), interaction.channelId, routineIdOptions);
			messageContent = result ? 'Routine deleted successfully.' : 'Failed to delete routine.';
		}
		else if (actionOptions === 'update') {
			const result = await updateRoutine(dbo, guild.name.replaceAll(' ', '-'), interaction.channelId, routineIdOptions);
			messageContent = result ? 'Routine updated successfully.' : 'Failed to update routine.';
		}
	}
	catch (err) {
		console.error('Error processing routine:', err);
		messageContent = `An error occurred: ${err.message}`;
	}
	finally {
		await dbo.close();
	}

	await interaction.reply({ content: messageContent, ephemeral: true });
};


const routineHandler = async (client, interaction, responseUrl) => {
	if (!responseUrl) {
		return;
	}

	const { guild, member } = interaction;
	if (!guild || !member) {
		await ephemeralWarning(interaction, 'This command can\'t be used in DMs.');
		return;
	}

	const routineOptions = interaction.options.getString('routine');
	const timeOptions = interaction.options.getString('time');
	const timezoneOptions = interaction.options.getString('timezone') || 'UTC';
	const roleOptions = interaction.options.getString('role');
	const contextOptions = interaction.options.getString('context') || 'Default context message';

	if (!routineOptions || !timeOptions) {
		await ephemeralWarning(interaction, 'Please ensure all required fields are selected.');
		return;
	}

	const threadContent = buildThreadContent(contextOptions, roleOptions);

	const dbo = await connectToDB();

	try {
		const slots = await createDaySlots(routineOptions, timeOptions, timezoneOptions);

		const server = guild.name.replaceAll(' ', '-');
		const channel = interaction.channelId;
		const scheduler = member.id;

		const rounte_id = await saveRoutine(dbo, server, channel, scheduler, routineOptions, timeOptions, timezoneOptions, roleOptions, threadContent);

		for (const slot of slots) {
			await saveRoutineSlot(dbo, server, channel, {
				rounte_id,
				name: `${slot[1]} Async Daily`,
				date: {
					day: slot[0],
					year: slot[1],
					hour: slot[2],
					minute: slot[3],
				},
				role: roleOptions,
				scheduler,
				threadContent,
				discord: {
					guild: guild,
					server_id: guild.id,
					channelId: interaction.channelId,
					message: responseUrl,
				},
			});
		}

		await interaction.followUp({
			content: `Routine scheduled successfully: \nID: ${rounte_id}\n${getFriendlyRoutineName(routineOptions)} - ${timeOptions}:00 ${timezoneOptions}`,
			ephemeral: true,
		});
	}
	catch (error) {
		console.error(`Error scheduling routine: ${error.message}`);
		await ephemeralWarning(interaction, `There was an issue scheduling your routine. ${error.message}`);
	}

	await dbo.close();
};

function buildThreadContent(context, role) {
	let content = 'Hey Hey, ';
	content += role ? `<@&${role}>,\n` : '\n';
	content += context;
	return content;
}


module.exports = { routineHandler, manageRoutineHandler, listHandler };
