/* eslint-disable no-inline-comments */
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// const client = new Discord.Client();
const prefix = '!';

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
	scheduleCheckupMessages();
});

client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (command === 'sendcheckup') {
		if (!message.member.permissions.has('SEND_MESSAGES')) {
			return message.channel.send('You do not have permission to send messages.');
		}

		sendCheckupMessage(message.channel);
	}
});

function scheduleCheckupMessages() {
	const checkupSchedule = [
		{ dayOfWeek: 1, hour: 9, minute: 0 }, // Monday 9:00 AM
		{ dayOfWeek: 3, hour: 14, minute: 30 }, // Wednesday 2:30 PM
		// Add more scheduled checkup times if needed
	];

	checkupSchedule.forEach((schedule) => {
		scheduleCheckup(schedule.dayOfWeek, schedule.hour, schedule.minute);
	});
}

function scheduleCheckup(dayOfWeek, hour, minute) {
	const now = new Date();
	const futureDate = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + ((dayOfWeek + 7 - now.getDay()) % 7),
		hour,
		minute,
	);

	const delay = futureDate.getTime() - now.getTime();
	if (delay < 0) return; // If the scheduled time has already passed, do nothing

	setTimeout(() => {
		sendCheckupMessageToGuilds();
		scheduleCheckup(dayOfWeek, hour, minute); // Reschedule the next checkup
	}, delay);
}

function sendCheckupMessageToGuilds() {
	client.guilds.cache.forEach((guild) => {
		const generalChannel = getGeneralChannel(guild);
		if (generalChannel) {
			sendCheckupMessage(generalChannel);
		}
	});
}

function sendCheckupMessage(channel) {
	const checkupMessage = `Hey Hey, <@&ROLE_ID>, ${getCurrentDate()} Async Daily, Please Create a thread and leave your updates,\nPlease use the following template:\n🙋‍♀️How I feel🙋‍♂️\n-\n-\n👩‍💻What I'm busy with🧑‍💻\n-\n-\n🧱Blockers I'm facing and suggestions to fix it🧱\n-\n-\n🤓Final remark🤓\n-\n-\nDo not forget to open a thread if there isn't any! 😉`;

	channel.send(checkupMessage)
		.then((sentMessage) => {
			channel.threads.create(sentMessage.content)
				.then((thread) => {
					console.log(`Created thread: ${thread.name}`);
				})
				.catch((error) => {
					console.error('Error creating thread:', error);
				});
		})
		.catch((error) => {
			console.error('Error sending checkup message:', error);
		});
}

function getGeneralChannel(guild) {
	const generalChannel = guild.channels.cache.find(channel =>
		channel.name.toLowerCase().includes('general')
    && channel.type === 'GUILD_TEXT'
    && channel.permissionsFor(guild.me).has('SEND_MESSAGES'),
	);

	return generalChannel;
}

function getCurrentDate() {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

client.login(process.env.DISCORD_TOKEN);