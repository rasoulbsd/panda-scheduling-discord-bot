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
				.setName('time')
				.setDescription('For what time do you want this routine to be enabled (UTC)?')
				.setRequired(true)
				.addChoices(
					{ name: '10:00 (UTC)', value: '10' },
					{ name: '13:00 (UTC)', value: '13' },
					{ name: '15:00 (UTC)', value: '15' },
					{ name: '19:00 (UTC)', value: '19' },
				),
		).addStringOption((option) =>
			option
				.setName('role')
				.setDescription('Select a role to mention them on the routine'),
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