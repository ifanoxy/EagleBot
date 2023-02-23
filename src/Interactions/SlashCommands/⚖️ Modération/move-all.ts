import {ChannelType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { DiscordColor } from "../../../structures/Enumerations/Embed";

export default {
    data: new SlashCommandBuilder()
        .setName("move-all")
        .setDescription("Permet de déplacer tout les membres dans un channel")
        .setDMPermission(false)
        .addChannelOption(
            opt => opt.setName("channel").setDescription("Sélectionner le channel où vous voulez déplacer les membres").addChannelTypes(ChannelType.GuildVoice)
        ),
    execute(interaction: ChatInputCommandInteraction) {
        const channelId = interaction.options.getChannel("channel")?.id || interaction.guild.members.cache.get(interaction.user.id)?.voice?.channelId;
        if (!channelId)return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("Vous devez être dans un channel vocal ou en définir un")
                    .setColor("Red")
            ],
            ephemeral: true
        })
        interaction.guild.voiceStates.cache.map(member => {
            member.setChannel(channelId, `Demandé par ${interaction.user.tag} (${interaction.user.id}) | Move-all commande`).catch()
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(DiscordColor.Eagle)
                    .setDescription(`Le membre \`${interaction.user.tag}\` a déplacer **${interaction.guild.voiceStates.cache.size}** membres dans le channel <#${channelId}>`)
            ]
        })
    }
}