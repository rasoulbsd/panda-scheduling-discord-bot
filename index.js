const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { sendMessageHandler } = require('./handlers/sendMessage');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
const router = express.Router();

const auth = basicAuth({
	users: { [process.env.BASIC_AUTH_USERNAME]: process.env.BASIC_AUTH_PASSWORD },
	unauthorizedResponse: 'Unauthorized Access',
});

router.get('/health', (req, res) => res.status(200).send('Ok'));
router.post('/api/sendMessage', auth, (req, res) => sendMessageHandler(req, res, client));
app.use('/', router);

const server = http.createServer(app);
server.listen(8080, () => console.log('Server running on port 8080'));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
	const folderPath = path.join(commandsPath, folder);
	const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(folderPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.warn(`[WARNING] The command at ${filePath} is missing "data" or "execute" property.`);
		}
	}
}

client.on('ready', () => {
	console.log('Discord bot is ready!');
	client.user.setActivity('Handling Routines');
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction, client);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
	}
});

client.login(process.env.DISCORD_TOKEN);
