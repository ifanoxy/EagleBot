const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder }= require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("autoreply-create")
        .setDescription("Vous permet de créer une préponse automatique à un message")
        .setDMPermission(false)
        .addStringOption(
            option => option.setName("question").setDescription("Quelle est la question que vous souhaitez répondre").setRequired(true)
        )
        .addStringOption(
            option => option.setName("réponse").setDescription("Définissez la réponse à la question").setRequired(true)
        ),
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        const question = interaction.options.getString("question");
        const reponse = interaction.options.getString("réponse");

        var guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId,
        });

        guildData.autoreply.push({
            question: question,
            reponse: reponse,
        });

        guildData.save()

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Vous venez d'ajouter un auto reply")
                    .setColor("#eb2384")
                    .addFields(
                        {
                            name: "Question",
                            value: `${question}`
                        },
                        {
                            name: "Réponse",
                            value: `${reponse}`,
                        }
                    )
            ]
        });
    }
}