const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("copy-emoji")
    .setDescription('permet de copier et émoji et de le créer sur votre serveur.')
    .setDMPermission(false)
    .addStringOption(
        opt => opt.setName("emoji").setDescription("insérez l'émoji que vous souhaitez copier").setRequired(true)
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

        const respond = interaction.options.getString('emoji')
        const regex = /\<(.*?)\>/;
        const emojiId = regex.exec(respond)[1].split(":")[2]
        console.log(emojiId)
    }
}