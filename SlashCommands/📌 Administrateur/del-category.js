const { SlashCommandBuilder, ChannelType, CommandInteraction, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("del-categorie")
    .setDescription("Permet de supprimer une catégorie avec ses channels")
    .setDMPermission(false)
    .addChannelOption(
        opt => opt.setName("categorie").setDescription("la categorie que vous voulez supprimer").setRequired(true).addChannelTypes(ChannelType.GuildCategory)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
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

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Suppression de la catégorie "+interaction.options.getChannel("categorie").name)
                .setDescription(`Nombre de channel à supprimer : \`${interaction.guild.channels.cache.size}\``)
                .setColor("Purple")
            ]
        })
        const channels = interaction.guild.channels.cache.filter(chn => chn?.parentId == interaction.options.getChannel("categorie").id);
        channels.map(channel => {
            channel.delete(`Demandé par ${interaction.user.tag}`).catch(() => {})
        })
        interaction.options.getChannel("categorie").delete().catch(() => {})
    }
}