const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Vous permet de voir la latence du bot."),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({name:"Latence du bot", iconURL: client.user.avatarURL()})
                .setDescription(`
                **Latence du bot:** \`${Date.now() - interaction.createdTimestamp}ms\`
                **Latence API:** \`${Math.round(client.ws.ping)}ms\`
                **Latence Anti Raid:** \`${client.antiraidClient.guilds.get(interaction.guildId).shard.latency}ms\`
                `)
                .setColor("Aqua")
            ],
            ephemeral: true
        })
    }
}