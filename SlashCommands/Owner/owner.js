const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { EagleClient } = require('../../structures/Client')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("owner")
    .setDescription("Permet d'ajouter une personne owner du bot")
    .setDMPermission(false)
    .addUserOption(
        option => option.setName("user").setDescription("entrez la personne que vous shouaitez whitelist").setRequired(true)
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

        
        if (client.moderation.checkOwner(id))return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Cette utilisateur est déjà owner")
            ],
            ephemeral: true
        });
        
        client.managers.ownerManager.getAndCreateIfNotExists(id, {
            userId: id,
        }).save()

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`Vous avez ajouté <@${id}> en tant que owner`)
            ]
        });
    }
}