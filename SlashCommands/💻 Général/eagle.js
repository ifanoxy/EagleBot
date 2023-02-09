const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("eagle")
    .setDescription("Envoie un lien d'invation vers le discord d'Eagle BOT"),
    execute(interaction, client) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Lien d'inviation vers le discord d'Eagle Bot")
                .setDescription("https://discord.com/invite/vdSRK2Bcx9")
                .setTimestamp()
            ],
            ephemeral: true
        })
    }
}   