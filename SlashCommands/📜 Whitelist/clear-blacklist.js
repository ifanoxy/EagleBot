const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandInteraction } = require("eris");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("bl-clear")
    .setDescription("Permet de clear la blacklist")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     * @returns 
     */
    execute(interaction, client) {
        if (!client.moderation.checkWhitelist(interaction.member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être whitelist pour utiliser cette commande !")
            ],
            ephemeral: true
        });

        try {
            client.managers.blacklistsManager.map(a => a.delete())
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Tout les ids de la blacklist ont été supprimés")
                ]
            });
        } catch {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Il y a eu un problème lors de l'exécution de cette commande !")
                ],
                ephemeral: true
            });
        }
    }
}