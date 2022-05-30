const { Client, Collection, Intents, Message } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
    intents : [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES	
	]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('Bot Running...');
});

const prefix = '-';

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
    const commandText = args.shift().toLowerCase();
    const command = client.commands.get(commandText);

	if (!command) return;

	try {
		await command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})

client.login(process.env.DISCORD_TOKEN);