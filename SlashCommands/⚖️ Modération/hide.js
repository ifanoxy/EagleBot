const { SlashCommandBuilder, ChannelType, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hide')
    .setDescription("Vous permet de cacher un channel du rôle everyone ou role défini")
    .setDMPermission(false)
    .addChannelOption(
        opt => opt.setName("channel").setDescription("Channel que vous souhaitez cacher").setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildVoice)
    )
    .addRoleOption(
        opt => opt.setName("role-hide").setDescription("Le role qui n'aura plus accès au channel")
    ),
    execute(interaction, client) {
        const channel = interaction.options.getChannel("channel")
        channel.permissionOverwrites.create(interaction.options.getRole("role-hide") || interaction.guild.roles.everyone, {
            ViewChannel: false 
        })
        .then(() => {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle("Channel caché avec succès !")
                    .setDescription(`Vous avez enlevé la permission du role <@&${interaction.options.getRole("role-hide") ? interaction.options.getRole("role-hide") : interaction.guild.roles.everyone}>\nDe voir le channel ${interaction.options.getChannel("channel")}`)
                ],
                ephemeral: true
            });
        })
        .catch(err => {
            client.error(`Erreur de hide channel : ${err}`);
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