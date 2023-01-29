const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { EagleClient } = require('../../structures/Client')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("unbl")
    .setDescription("Permet de retirer une personne à la blacklist")
    .addStringOption(
        option => option.setName("id").setDescription("entrez l'identifiant de la personne que vous shouaitez unblacklist").setRequired(true)
    ),
    /**
     * 
     * @param {} interaction 
     * @param {EagleClient} client 
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
        const id = interaction.options.getString("id");

        if (client.config.ownerId == id) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous ne pouvez pas blacklist les owners !")
            ],
            ephemeral: true
        });
        
        const blacklistdata = client.managers.blacklistsManager.getAndCreateIfNotExists(id, {
            userId: id,
        })

        if(!blacklistdata)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription("L'identifiant est introuvable dans la blacklist")
            ],
            ephemeral: true
        });
        blacklistdata.delete()

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("LuminousVividPink")
                .setDescription(`Vous avez retirer l'identifiant \`${id}\` de la blacklist`)
            ]
        });
    }
}