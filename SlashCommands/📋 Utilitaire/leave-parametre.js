const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("leave-parametre")
    .setDescription("Voir tout les paramètres disponibles pour les messages de leave")
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

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Liste de tout les paramètres pour les messages de départ.")
                .setColor("White")
                .setDescription(`
                {member-name} --> Pseudo du membre.
                {member-tag} --> Pseudo + # du membre.
                {member-id} --> Identifiant du membre.
                {member-mention} --> Mentionne le membre.
                {member-avatar} --> lien de l'avatar du membre.
                {member-age} --> La date de création du compte.
                `)
            ],
            ephemeral: true
        })
    }
}