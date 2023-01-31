const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder }= require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("auto-reply-liste")
        .setDescription("Permet d'affichier la liste des questions avec leur réponse")
        .setDMPermissions(false),
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        var guildData = client.managers.guildsManager.getIfExist(interaction.guildId, {
            guildId: interaction.guildId,
        });

        if (!guildData) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setName("Vous n'avez créer aucun auto reply")
                    .setDescription("Utiliser la commande /auto-reply-create pour en créer")
            ]
        })

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Vous venez d'ajouter un auto reply")
                    .setColor("#eb2384")
                    .addFields(
                        guildData.autoreply.map(autorep => {
                            return {
                                name: autorep.question,
                                value: autorep.reponse,
                            }
                        })
                    )
            ]
        });
    }
}