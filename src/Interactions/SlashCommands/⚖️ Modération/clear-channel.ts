import {BaseGuildTextChannel, ChannelType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("clear-channel")
        .setDescription("Supprimer un channel et le recréer")
        .setDMPermission(false)
        .addChannelOption(
            opt => opt.setName("channel").setDescription("le channel que vous souhaitez clear").addChannelTypes(ChannelType.GuildText).setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {

        const channel = await interaction.guild.channels.fetch(interaction.options.getChannel("channel").id, {force: true, cache: true});
        if (channel.type == ChannelType.GuildText) {
            channel.delete(`Demandé par ${interaction.user.tag} (${interaction.user.id}) | Clear Channel`).then(() => {
                interaction.guild.channels.create({
                    name: channel.name,
                    reason: `Demandé par ${interaction.user.tag} (${interaction.user.id}) | Clear Channel`,
                    topic: channel.topic,
                    permissionOverwrites: channel.permissionOverwrites.cache,
                    parent: channel.parent?.id,
                    type: channel.type,
                    position: channel.rawPosition,
                    rateLimitPerUser: channel.rateLimitPerUser,
                    nsfw: channel.nsfw,
                })
                    .then(chan => {
                        if (interaction.isRepliable())
                        {
                            interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor("Blurple")
                                        .setDescription(`Le channel \`${channel.name}\` à été supprimer et recréer <#${chan.id}>`)
                                        .setTimestamp()
                                ],
                                ephemeral: true
                            })
                        }
                        chan.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Green")
                                    .setDescription(`Ce channel a été supprimer et recréer par \`${interaction.user.tag}\``)
                                    .setTimestamp()
                            ]
                        })

                    })
            })
        }
    }
}