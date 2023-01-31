const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("getcouronne")
    .setDescription("permet de récuperer la couronne si le bot l'a")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
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
        if (interaction.guild.ownerId != client.user.id)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("je ne possède pas la couronne du serveur")
            ],
            ephemeral: true
        });

        interaction.guild.setOwner(interaction.member).then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Green")
                    .setDescription("Vous êtes maintenant le propriétaire de ce serveur")
                ]
            })
        })
    }
}