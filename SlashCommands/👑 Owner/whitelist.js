const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { EagleClient } = require('../../structures/Client')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("wl")
    .setDescription("Permet d'ajouter une personne à la whitelist")
    .setDMPermission(false)
    .addUserOption(
        option => option.setName("user").setDescription("entrez  la personne que vous shouaitez whitelist").setRequired(true)
    ).addStringOption(
        option => option.setName("raison").setDescription("entrez la raison pour laquelle vous shouaitez whitelist cette personne").setRequired(false)
    ),
    /**
     * 
     * @param {} interaction 
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

        const id = interaction.options.getUser("user").id;
        
        if (client.moderation.checkWhitelist(id))return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Cette utilisateur est déjà dans la whitelist")
            ],
            ephemeral: true
        });
        const raison = interaction.options.getString("raison");
        
        client.managers.whitelistsManager.getAndCreateIfNotExists(id, {
            userId: id,
            reason: raison || "pas de raison",
            authorId: interaction.member.id,
        }).save()

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`Vous avez ajouté <@${id}> à la whitelist`)
            ]
        });
    }
}