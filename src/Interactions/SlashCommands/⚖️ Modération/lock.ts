import {ChannelType, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";
import { DiscordColor } from "../../../structures/Enumerations/Embed";

export default {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Vous permet d'enlever la permission d'un rôle d'écrire")
        .setDMPermission(false)
        .addRoleOption(
            opt => opt.setName("role").setDescription("le rôle dont vous souhaitez lock le channel").setRequired(false)
        ),
    async execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const role = interaction.guild.roles.cache.get(interaction.options.getRole("role")?.id) || interaction.guild.roles.everyone;
        const channel = interaction.channel;
        if (channel.permissionsFor(role).has("SendMessages")) {
            if (channel.type == ChannelType.GuildText) {
                channel.permissionOverwrites.edit(role, {
                    SendMessages: false
                }).then(() => {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(DiscordColor.Eagle)
                                .setDescription(`Ce channel a été lock par \`${interaction.user.tag}\` ${role.name == "@everyone" ? "" : `pour le rôle <@&${role.id}>`}`)
                        ]
                    })
                }).catch((err) => {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setDescription(`Il y a eu une erreur pour lock ce channel !\n\nErreur: ${err}`)
                        ],
                        ephemeral: true
                    })
                })
            }
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`**Ce channel est déjà lock pour se rôle !**\nVoulez vous unlock ? --> ${client.func.utils.slashCommandSend("unlock")}`)
                        .setColor("Red")
                ],
                ephemeral: true
            })
        }
    }
}