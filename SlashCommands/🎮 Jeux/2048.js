const { SlashCommandBuilder, CommandInteraction, ActionRowBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("2048")
    .setDescription("Vous permet de jouer à 2048"),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     */
    execute(interaction, client) {
        let embed2048 = new EmbedBuilder()
        .setTitle("2048")
        .setDescription("🟥 --> La case est apparue\n🟩 --> La case vient de fusionner")
        .setColor("DarkGreen")
        .addFields(
            {
                name: "score actuel",
                value: "`0`",
                inline: true
            },
        )

        interaction.reply({
            embeds: [
                embed2048
            ],
            ephemeral: true,
        })
    }
}