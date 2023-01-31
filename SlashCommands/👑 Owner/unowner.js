const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { EagleClient } = require('../../structures/Client')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unowner")
    .setDescription("Permet d'enlever l'owner d'un indentifiant")
    .setDMPermission(false)
    .addStringOption(
        option => option.setName("id").setDescription("entrez l'identifiant de la personne que vous shouaitez unowner").setRequired(true)
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
        
        const id = interaction.options.getString("id");

        if (client.config.ownerId == id) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous ne pouvez pas enlever l'owner principal !")
            ],
            ephemeral: true
        });
        
        const ownerData = client.managers.ownerManager.getAndCreateIfNotExists(id, {
            userId: id,
        })

        if(!ownerData)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription("L'identifiant n'est pas owner")
            ],
            ephemeral: true
        });
        ownerData.delete()

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("LuminousVividPink")
                .setDescription(`L'identifiant \`${id}\` n'est plus owner`)
            ]
        });
    }
}