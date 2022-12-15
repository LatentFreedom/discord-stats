import { EmbedBuilder, ChannelType } from 'discord.js'

const sendStats = async (client, message) => {

    // Get data
    const guild = client.guilds.cache.get(message.guildId)
    const members = await guild.members.fetch({ withPresences: true })
    const totalServers = client.guilds.cache.size
    let totalMembers = 0
    let totalBots = 0
    members.map(m => {
        if (m.user.bot) {
            totalBots += 1
        } else {
            totalMembers += 1
        }
    })

    const onlineMembers = members.filter(member => !member.user.bot && member.presence?.status == "online").size
    const offlineMembers = members.filter(member => !member.user.bot && member.presence?.status == "offline").size
    const onlineBots = members.filter(member => member.user.bot && member.presence?.clientStatus?.web == "online").size
    // const offlineBots = (await guild.members.fetch()).filter(member => member.user.bot && member.presence.status == "online").size

    // Style message
    const embed = new EmbedBuilder()
        .setThumbnail(message.guild.iconURL())
        .setTitle(`Server Stats`)
        .addFields(
            { name: 'Servers', value: `${totalServers}` },
            { name: 'Bots', value: `${totalBots}`, inline: true },
            { name: 'Online', value: `${onlineBots}`, inline: true },
            { name: 'Offline', value: `${totalBots - onlineBots}`, inline: true },
        )

    // BOTS
    let botText = ''
    members.map(member => {
        if (member.user.bot) {
            botText += `<@${member.user.id}>\n`
        }
    })
    embed.addFields({ name: 'Bots', value: botText })

    embed.addFields(
        { name: 'Members', value: `${totalMembers}`, inline: true },
        { name: 'Online', value: `${onlineMembers}`, inline: true },
        { name: 'Offline', value: `${offlineMembers}`, inline: true },
    )

    // ROLES
    let rolesText = ''
    guild.roles.cache.map(role => {
        rolesText += `${role}: ${role.members.size}\n`
    })
    embed.addFields({ name: 'Roles', value: rolesText })

    // CHANNELS
    const channels = await guild.channels.fetch()
    let totalChannels = 0
    channels.map(channel => {
        if (channel.type !== ChannelType.GuildCategory) {
            totalChannels += 1
        }
    })
    embed.addFields({ name: 'Channels', value: `${totalChannels}`, inline: true})

    // Send message
    await message.channel.send({ embeds: [embed] })

}

const command = {
	name : 'stats',
    description : 'Print server stats',
	async execute(message, args, client) {

        await sendStats(client, message)

	},
}

export { command }