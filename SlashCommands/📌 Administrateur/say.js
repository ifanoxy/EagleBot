const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("permet de dire quelque chose avec le bot - \p pour retour à la ligne")
    .addStringOption(
        opt => opt.setName("texte").setDescription("ce que vous souhaitez écrire").setRequired(true)
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
        interaction.channel.send(interaction.options.getString("texte").replaceAll("\p", "\n"))
        interaction.reply({
            embeds: [
                new EmbedBuilder().setColor("Blurple").setDescription("Votre message à bien été envoyé")
            ],
            ephemeral: true
        })
    }
}