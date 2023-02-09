const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-avatar")
    .setDescription("Permet de changer l'avatar du bot")
    .addAttachmentOption(
        opt => opt.setName("new-avatar").setDescription("le nouveau avatar du bot").setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
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
        interaction.deferReply()

        client.user.setAvatar(interaction.options.getAttachment("new-avatar").url)
        .then(() => {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez changer l'avatar du bot avec succès")
                    .setColor("Green")
                    .setDescription("Nouveau avatar :")
                    .setImage(interaction.options.getAttachment("new-avatar").url)
                    .setTimestamp()
                ]
            })
        })
        .catch(err => {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Il y a eu une erreur lors du changement d'avatar ")
                    .setColor("Red")
                    .setDescription("Erreur: " +err)
                    .setTimestamp()
                ],
                ephemeral: true
            })
        })
    }
}