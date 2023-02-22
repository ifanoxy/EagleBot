import {ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";
import { DiscordColor } from "../../../structures/Enumerations/Embed";

export default {
    data: new SlashCommandBuilder()
        .setName("user-info")
        .setDescription("Vous permet d'obtenir des renseignements sur un membre")
        .setDMPermission(false)
        .addUserOption(
            opt => opt.setName("utilisateur").setDescription("L'utilisateur dont vous souhaitez voir les informations").setRequired(true)
        ),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const user = interaction.options.getUser("utilisateur");
        const member = interaction.guild.members.cache.get(user.id);
        const memberData = client.managers.membersManager.getIfExist(user.id);
        let i = 0;
        interaction.reply({
            embeds: [
                {
                    author: {
                        icon_url: user.avatarURL(),
                        name: `Informations sur l'utilisateur ${user.username}`
                    },
                    thumbnail: {
                        url: user.bannerURL() || null
                    },
                    fields: [
                        {
                            name: "Identifiant",
                            value: user.id,
                            inline: true
                        },
                        {
                            name: "Création du compte",
                            value: `<t:${Math.round(user.createdTimestamp/1000)}>`,
                            inline: true,
                        },
                        {
                            name: "Badges",
                            value: `${user.flags.toArray().join(", ").replace("HypeSquadOnlineHouse1", "House Bravery Member").replace("HypeSquadOnlineHouse2", "House Brilliance Member").replace("HypeSquadOnlineHouse3", "House Balance Member") || "`Aucun badge`"}`,
                            inline: true,
                        },
                        {
                            name: "Nick",
                            value: `${member.nickname || "`Pas de nick`"}`,
                            inline: true
                        },
                        {
                            name: "Nombre de roles",
                            value: member.roles.cache.size.toString(),
                            inline: true
                        },
                        {
                            name: "Channel vocal du membre",
                            value: member.voice.channelId ? `<#${member.voice.channelId}>` : "`Dans aucun channel vocal`",
                            inline: true
                        },
                        {
                            name: "Status",
                            value: member.presence ? `${member.presence.status == "dnd" ? "Ne pas dérange" : member.presence.status == "online" ? "En ligne" : member.presence.status == "idle" ? "Afk" : "Hors ligne / Invisible" }\n`+ member.presence.activities.map(x => {
                                i++;return `__${i}. ${x.name}__\n> **Type:** ${x.type == 0 ? "Joue" : x.type == 2 ? "Stream" : x.type == 3 ? "Ecoute" : x.type == 4 ? "Custom" : "Compétition"}\n> **Depuis:** ${x.type != 4 ? `<t:${Math.round(new Date(x.timestamps.start).getTime()/1000)}:R>` : "pas de temps"}\n> **Status:** ${x.state}`
                            }).join("\n") : "Hors Ligne / Invisible",
                            inline: true
                        },
                        {
                            name: "Modération",
                            value: `\`${memberData?.values.moderation.warn || "0"}\` Warns Donnés\n\`${memberData?.values.moderation.kick || "0"}\` Membres Kick\n${memberData?.values.moderation.mute || "0"} Membres Mutes\n\`${memberData?.values.moderation.ban || "0"}\` Membres Bannis\n\`${memberData?.values.moderation.removedMessage || "0"}\` Messages Supprimés`,
                            inline: true
                        },
                        {
                            name: "Avertisements",
                            value: memberData?.values.warn.map(x => `Donné par <@${x.userId}> <t:${Math.round(new Date(x.date).getTime()/1000)}:R> pour la raison: ${x.reason}`).join("\n") || "``Aucun Avertissements``",
                        },
                        {
                            name: "Permissions",
                            value: "`"+member.permissions.toArray().join('`, `')+"`"
                        },
                    ],
                    color: member.displayColor,
                }
            ]
        })
    }
}