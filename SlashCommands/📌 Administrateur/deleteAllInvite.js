const { SlashCommandBuilder, PermissionsBitField, CommandInteraction, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("delete-all-invites")
    .setDescription("Permet de supprimer toute les invitations d'un serveur.")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     * @returns 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        interaction.deferReply({
            ephemeral: true
        }).then(async () => {
            const nbrInvite = await interaction.guild.invites.fetch().then(invite => invite.size)
            let nbrInviteDelete = 0;
            interaction.guild.invites.fetch().then(invites => {
                invites.map(invite => {
                    if (!invite.deletable)return;
                    invite.delete();
                    nbrInviteDelete++;
                });
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Suppression des invitations")
                        .setDescription(`\`${nbrInviteDelete}/${nbrInvite}\` des invitations on été supprimés avec succès`)
                        .setColor("Red")
                    ],
                })
            });
        })
    }
}