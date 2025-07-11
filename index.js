const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags, ActivityType } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	// discord rich presence stuff		
	const names = ['One Piece', 'Monogatari Series', 'Serial Experiments Lain', 'Haibane Renmei', 'Angel Beats',
		'Welcome to the NHK', 'Grand Blue Dreaming', 'Vinland Saga','Madoka Magica', 'Bleach', 'Hunter x Hunter',
		'Nana', 'Samural Champloo', 'Beck', 'Fate Stay/Night', 'Frieren', 'Toradora', 'Chainsaw Man', 'Dorohedoro'];
	
	const random = names[Math.floor(Math.random() * names.length)];

	const randomActivity = () => {
		const random = names[Math.floor(Math.random() * names.length)];	
		
		client.user.setActivity({
			type: ActivityType.Watching,
			name: random
	})};

	randomActivity();
	setInterval(randomActivity, 20 * 60 * 1000);
	// note to self, in ms. 60 x 1000 = 1 min x 20 = every 20 minutes
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
	const command = interaction.client.commands.get(interaction.commandName)

	if (!command) {
		console.error("Command was not found..")
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});


client.login(process.env.DISCORD_TOKEN);