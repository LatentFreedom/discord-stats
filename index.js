import { Client, Collection, GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'
import fs from 'fs'

config({ path: './.env' })

const client = new Client({
    intents : [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.MessageContent
	]
})

client.commands = new Collection()

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = await import(`./commands/${file}`)
    client.commands.set(command.command.name, command.command)
}

client.on('ready', () => {
    console.log('Stats Bot Running...')
})

client.on('messageCreate', async (message) => {
	const prefix = '-'
    
	// Check if message came from a bot
	if (message.author.bot) return

	// Check for command prefixes
    if (!message.content.startsWith(prefix)) return

	const args = message.content.slice(prefix.length).split(/ +/)
    const commandText = args.shift().toLowerCase()
    const command = client.commands.get(commandText)
	if (!command) return

	try {
		await command.execute(message, args, client)
	} catch (error) {
		console.error(error)
		await message.reply({ content: 'There was an error while executing this command!', ephemeral: true })
	}
})

client.login(process.env.DISCORD_TOKEN)