const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("join-test")
    .setDescription("Permet de testé le message de join")
    .setDMPermission(false),
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        let guildData = client.managers.guildsManager.getIfExist(interaction.guildId);

        if (!guildData || !guildData.join?.channelId)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Il n'y a pas de message de join créé !")
            ],
            ephemeral: true
        });

        if (!interaction.guild.channels.cache.get(guildData.join?.channelId)) {
            guildData.join = {channelId: null, message: {content: null, embed: null}};
            guildData.save();

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Le channel a été supprimé ou est introuvable, veuillez recréer le message de join")
                ],
                ephemeral: true
            });
        };

        client.fonctions.sendJoinMessage(interaction.guildId, interaction.guild.members.cache.get(interaction.user.id))
    }
}