const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("auto-role")
    .setDMPermission(false)
    .setDescription("Permet de définir quel rôle sera ajouté automatiquement")
    .addRoleOption(
        opt => opt.setName("role").setDescription("Choisissez le rôle qui sera ajouté automatiquement").setRequired(true)
    ),
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        let guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId);
        guildData.autoroles.push(interaction.options.getRole("role").id);
        guildData.save();
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Vous venez de définir l'auto role")
                .setColor("Greyple")
            ]
        })
    }
}