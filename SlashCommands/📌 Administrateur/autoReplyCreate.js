const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder }= require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("auto-reply-create")
        .setDescription("Vous permet de créer une préponse automatique à un message")
        .setDMPermissions(false)
        .addStringOption(
            option => option.setName("question").setDescription("Quelle est la question que vous souhaitez répondre").setRequire(true)
        )
        .addStringOption(
            option => option.setName("réponse").setDescription("Définissez la réponse à la question").setRequire(true)
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

        const question = interaction.options.get("question");
        const reponse = interaction.options.get("réponse");

        var guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId,
        });

        guildData.autoreply.push({
            question: question,
            reponse: reponse,
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Vous venez d'ajouter un auto reply")
                    .setColor("#eb2384")
                    .addFields(
                        {
                            name: "Question",
                            value: question
                        },
                        {
                            name: "Réponse",
                            value: reponse,
                        }
                    )
            ]
        });
    }
}