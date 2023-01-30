const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { EagleClient } = require('../../structures/Client')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unwl")
    .setDescription("Permet de retirer un identifiant de la whitelist")
    .setDMPermission(false)
    .addStringOption(
        option => option.setName("id").setDescription("entrez l'identifiant de la personne que vous shouaitez unwhiteliste").setRequired(true)
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
                .setDescription("Vous ne pouvez pas enlever l'owner principal de la whitelist !")
            ],
            ephemeral: true
        });
        
        const whitelistdata = client.managers.whitelistsManager.getAndCreateIfNotExists(id, {
            userId: id,
        })

        if(!whitelistdata)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription("L'identifiant est introuvable")
            ],
            ephemeral: true
        });
        whitelistdata.delete()

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("LuminousVividPink")
                .setDescription(`Vous avez retirer l'identifiant \`${id}\` de la whitelist`)
            ]
        });
    }
}