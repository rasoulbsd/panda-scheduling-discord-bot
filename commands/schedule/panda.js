const { SlashCommandBuilder } = require('discord.js');
const { routineHandler } = require('../../handlers/panda');
const { getMsgLink } = require('../../utils/format');

const panda = {
	data: new SlashCommandBuilder()
		.setName('panda')
		.setDescription('Schedule a new check-in routine')
		.addStringOption((option) =>
			option
				.setName('routine')
				.setDescription('For what routine do you want to ask for check-in?')
				.setRequired(true)
				.addChoices(
					{ name: 'Everyday', value: 'monday-tuesday-wednesday-thursday-friday' },
					{ name: 'Even Days', value: 'monday-wednesday-friday' },
					{ name: 'Odd Days', value: 'tuesday-thursday' },
				),
		).addStringOption((option) =>
			option
				.setName('timezone')
				.setDescription('Select a timezone for the routine')
				.setRequired(true)
				.addChoices(
					{ name: 'UTC', value: 'UTC' },
					{ name: 'Eastern Time (ET)', value: 'America/New_York' },
					{ name: 'Central Time (CT)', value: 'America/Chicago' },
					{ name: 'Mountain Time (MT)', value: 'America/Denver' },
					{ name: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
					{ name: 'India Standard Time (IST)', value: 'Asia/Kolkata' },
				),
		).addStringOption((option) =>
			option
				.setName('time')
				.setDescription('For what time do you want this routine to be enabled (UTC)?')
				.setRequired(true)
				.addChoices(
					...Array.from({ length: 24 }, (_, i) => ({
						name: `${i}:00`,
						value: `${i}`,
					})),
				),
		).addStringOption((option) =>
			option
				.setName('role')
				.setDescription('Select a role to mention them on the routine'),
		).addStringOption((option) =>
			option
				.setName('context')
				.setDescription('Write a custom message for the routine'),
		),
	async execute(interaction, client) {
		if (!interaction.isCommand() || interaction.commandName !== 'panda') {return;}

		const msg = await interaction.deferReply({ fetchReply: true });

		await routineHandler(
			client,
			interaction,
			getMsgLink(interaction.guildId || '', interaction.channelId || '', msg.id),
		);
	},
};

module.exports = panda;