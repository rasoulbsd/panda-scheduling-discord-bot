const express = require('express');
const http = require('http');
const fs = require('node:fs');
const path = require('node:path');
const basicAuth = require('express-basic-auth'); // Install this package if not already installed
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { sendMessageHandler } = require('./handlers/sendMessage');
require('dotenv').config();

const app = express();
const router = express.Router();

const auth = basicAuth({
	users: {
	  [process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD,
	},
	unauthorizedResponse: 'Unauthorized Access',
  });
  

router.use((req, res, next) => {
	res.header('Access-Control-Allow-Methods', 'GET, POST');
	next();
});

router.get('/health', (req, res) => {
	res.status(200).send('Ok');
});

router.post('/api/sendMessage', auth, (req, res) => {
	sendMessageHandler(req, res);
});


app.use('/', router);

const server = http.createServer(app);
server.listen(8080);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(process.env.DISCORD_TOKEN);
