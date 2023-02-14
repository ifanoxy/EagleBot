const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("server-banner")
    .setDescription("Permet d'avoir la bannière du serveur")
    .setDMPermission(false)
    .addBooleanOption(
        opt => opt.setName("anonyme").setDescription("Voulez vous que votre réponse reste anonyme ?")
    ),
    /**
     * 
     * @param {EagleClient}client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        const ephemeral = interaction.options.getBoolean("anonyme") || true;
        if (!interaction.guild.banner) return interaction.reply({
            embeds: [
                new EmbedBuilder().setColor("Red").setDescription("Ce serveur n'a pas de bannière !")
            ],
            ephemeral: true
        });
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setAuthor({name: `Bannière du serveur ${interaction.guild.name}`, iconURL: interaction.guild.iconURL()})
                .setImage(interaction.guild.bannerURL())
                .setColor("Random")
            ],
            ephemeral: ephemeral
        });
    }
}