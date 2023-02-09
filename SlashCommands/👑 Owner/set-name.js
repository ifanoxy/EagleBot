const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-name")
    .setDescription("Permet de changer le pseudo du bot")
    .addStringOption(
        opt => opt.setName("new-name").setDescription("le nouveau pseudo du bot").setRequired(true)
    ),
    /**
     * 
     * @param {*} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        if (!client.moderation.checkOwner(interaction.member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être owner pour utiliser cette commande !")
            ],
            ephemeral: true
        });

        client.user.setUsername(interaction.options.getString("new-name"))
        .then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez changer le pseudo du bot avec succès")
                    .setColor("Green")
                    .setDescription("Nouveau pseudo: " +interaction.options.getString("new-name"))
                    .setTimestamp()
                ]
            })
        })
        .catch(err => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Il y a eu une erreur lors du changement de pseudo ")
                    .setColor("Red")
                    .setDescription("Erreur: " +err)
                    .setTimestamp()
                ],
                ephemeral: true
            })
        })
    }
}