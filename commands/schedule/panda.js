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
					{ name: '01:00 (UTC)', value: '1' },
					{ name: '02:00 (UTC)', value: '2' },
					{ name: '03:00 (UTC)', value: '3' },
					{ name: '04:00 (UTC)', value: '4' },
					{ name: '05:00 (UTC)', value: '5' },
					{ name: '06:00 (UTC)', value: '6' },
					{ name: '07:00 (UTC)', value: '7' },
					{ name: '08:00 (UTC)', value: '8' },
					{ name: '09:00 (UTC)', value: '9' },
					{ name: '10:00 (UTC)', value: '10' },
					{ name: '11:00 (UTC)', value: '11' },
					{ name: '12:00 (UTC)', value: '12' },
					{ name: '13:00 (UTC)', value: '13' },
					{ name: '14:00 (UTC)', value: '14' },
					{ name: '15:00 (UTC)', value: '15' },
					{ name: '16:00 (UTC)', value: '16' },
					{ name: '17:00 (UTC)', value: '17' },
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