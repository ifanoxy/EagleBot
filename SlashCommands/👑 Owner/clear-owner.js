const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { CommandInteraction } = require("eris");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("owner-clear")
    .setDescription("Permet de clear la whitelist")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     * @returns     
     */
    execute(interaction, client) {
        if (interaction.member.id != client.config.ownerId) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être le propriétaire du bot pour utiliser cette commande !")
            ],
            ephemeral: true
        });

        try {
            client.managers.ownerlistsManager.map(a => a.delete())
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Tout les owners ont été supprimés")
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