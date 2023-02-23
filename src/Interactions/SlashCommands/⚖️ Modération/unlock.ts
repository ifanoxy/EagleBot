import {ChannelType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";
import { DiscordColor } from "../../../structures/Enumerations/Embed";

export default {
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Vous permet d'ajouter la permission d'un rôle d'écrire")
        .setDMPermission(false)
        .addRoleOption(
            opt => opt.setName("role").setDescription("le rôle dont vous souhaitez unlock le channel").setRequired(false)
        ),
    async execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const role = interaction.guild.roles.cache.get(interaction.options.getRole("role")?.id) || interaction.guild.roles.everyone;
        const channel = interaction.channel;
        if (!channel.permissionsFor(role).has("SendMessages")) {
            if (channel.type == ChannelType.GuildText) {
                channel.permissionOverwrites.edit(role, {
                    SendMessages: true
                }).then(() => {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(DiscordColor.Eagle)
                                .setDescription(`Ce channel a été unlock par \`${interaction.user.tag}\` ${role.name == "@everyone" ? "" : `pour le rôle <@&${role.id}>`}`)
                        ]
                    })
                }).catch((err) => {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setDescription(`Il y a eu une erreur pour unlock ce channel !\n\nErreur: ${err}`)
                        ],
                        ephemeral: true
                    })
                })
            }
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**Ce channel est déjà unlock pour se rôle !**\nVoulez vous lock ? --> ${client.func.utils.slashCommandSend("lock")}`)
                        .setColor("Red")
                ],
                ephemeral: true
            })
        }
    }
}