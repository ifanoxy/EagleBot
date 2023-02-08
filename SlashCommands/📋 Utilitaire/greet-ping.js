const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("greet-ping")
    .setDescription("Permet de ping un membre lorse qu'il rejoint")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Gestion des notifications automatiques pour les arrivants")
                .setDescription("Les 'greet-ping' sont des notifications qui sont envoyé dans des channels prédéfinis et qui sont supprimés 2 secondes après.")
                .setColor("Blurple")
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    
                )
            ]
        })
    }
}