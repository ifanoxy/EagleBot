const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('show')
    .setDescription("Vous permet de montrer un channel du rôle everyone ou d'un role choisi")
    .setDMPermission(false)
    .addChannelOption(
        opt => opt.setName("channel").setDescription("Channel que vous souhaitez montrer").setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildVoice)
    )
    .addRoleOption(
        opt => opt.setName("role-show").setDescription("Le role qui verra le channel")
    ),
    execute(interaction, client) {
        const channel = interaction.options.getChannel("channel")
        channel.permissionOverwrites.create(interaction.options.getRole("role-show") || interaction.guild.roles.everyone, {
            ViewChannel: true 
        })
        .then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle("Channel révélé avec succès !")
                    .setDescription(`Vous avez ajouté la permission du role <@&${interaction.options.getRole("role-show") ? interaction.options.getRole("role-show") : interaction.guild.roles.everyone}>\nDe voir le channel ${interaction.options.getChannel("channel")}`)
                ],
                ephemeral: true
            });
        })
        .catch(err => {
            client.error(`Erreur de show channel : ${err}`);
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("Une erreur est survenue")
                    .setDescription("Il y a eu une erreur lors du changement de permission du channel\n\nErreur:"+err)
                ],
                ephemeral: true
            });
        });
    }
}