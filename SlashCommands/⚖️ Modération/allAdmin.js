const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("all-admin")
    .setDescription("Affiche tout les membres avec la permission admin")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     * @returns 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({
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
                .setTitle("Les des membres avec la permission administrateur")
                .setColor("Orange")
                .setDescription(interaction.guild.members.cache.filter(mbr => !mbr.user.bot).filter(mbr => mbr.permissions.has(PermissionsBitField.Flags.Administrator)).map(mbr => `<@${mbr.id}>`).join("\n"))
            ]
        })
    }
}