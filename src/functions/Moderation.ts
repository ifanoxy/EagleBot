import {
    ButtonInteraction,
    ChannelType, CommandInteraction, GuildMember, MessageComponentInteraction, PermissionsBitField, TextChannel
} from "discord.js";
import { EagleClient } from "../structures/Client";
import { DiscordColor } from "../structures/Enumerations/Embed";


export default class Moderation {
    #client: EagleClient;
    constructor(client: EagleClient) {
        this.#client = client;
    }

    sendJoinMessage(guildId, member) {
        let guildData = this.#client.managers.guildsManager.getIfExist(guildId);
        if (!guildData)return;

        const channel = this.#client.guilds.cache.get(guildId).channels.cache.get(guildData.join?.channelId);
        if (!channel) {
            guildData.join = {channelId: null, message: {content: null, embed: null}};
            guildData.save();
            return;
        }

        let content = guildData.join.message.content;
        let embed = guildData.join.message.embed;

        const find = ["{member-name}","{member-tag}","{member-id}","{member-mention}","{member-avatar}","{member-age}"];
        const replace = [member.user.username, member.user.tag, member.id, `<@${member.id}>`, member.user.avatarURL(), `<t:${Math.round(member.user.createdTimestamp/1000)}>`];

        if (content) {
            content = content.replaceArray(find, replace);
        }
        if (embed) {
            embed = JSON.parse(JSON.stringify(embed).replaceArray(find, replace));
        }

        if (content && embed) { // @ts-ignore
            return channel.send({
                        content: content,
                        embeds: [ embed ]
                    })
        }
        else if (content) { // @ts-ignore
            return channel.send({
                        content: content
                    })
        }
        else { // @ts-ignore
            return channel.send({
                            embeds: [embed]
                        })
        }
    };

    sendLeaveMessage(guildId, member) {
        let guildData = this.#client.managers.guildsManager.getIfExist(guildId);
        if (!guildData)return;

        const channel = this.#client.guilds.cache.get(guildId).channels.cache.get(guildData.leave?.channelId);
        if (!channel) {
            guildData.leave = {channelId: null, message: {content: null, embed: null}};
            guildData.save();
            return;
        }

        let content = guildData.leave.message.content;
        let embed = guildData.leave.message.embed;

        const find = ["{member-name}","{member-tag}","{member-id}","{member-mention}","{member-avatar}","{member-age}"];
        const replace = [member.user.username, member.user.tag, member.id, `<@${member.id}>`, member.user.avatarURL(), `<t:${Math.round(member.user.createdTimestamp/1000)}>`];

        if (content) {
            content = content.replaceArray(find, replace);
        }
        if (embed) {
            embed = JSON.parse(JSON.stringify(embed).replaceArray(find, replace));
        }

        if (content && embed) { // @ts-ignore
            return channel.send({
                        content: content,
                        embeds: [ embed ]
                    })
        }
        else if (content) { // @ts-ignore
            return channel.send({
                        content: content
                    })
        }
        else { // @ts-ignore
            return channel.send({
                            embeds: [embed]
                        })
        }
    }

    cibleRoleIsBetter(cible: GuildMember, executor: GuildMember) {
        if (cible.roles.highest.rawPosition >= executor.roles.highest.rawPosition)
            return true;
        else return false;
    };

    executorIsOverCible(cible: GuildMember, executor: GuildMember) {
        const cibleWL: boolean = this.#client.isWhitelist(cible.id);
        const executorWL: boolean = this.#client.isWhitelist(executor.id);
        if (!cibleWL && executorWL)return 2;
        if (cibleWL && !executorWL)return null;
        if (!cibleWL && !executorWL)return 1;
        const cibleOwner: boolean = this.#client.isOwner(cible.id);
        const executorOwner: boolean = this.#client.isOwner(executor.id);
        if (!cibleOwner && executorOwner)return 2;
        if (cibleOwner && !executorOwner)return null;
        return 1
    };

    memberBannable(member: GuildMember, executor: GuildMember, interaction: CommandInteraction) {
        if (member.user.id == this.#client.user.id)
        {
            interaction.reply({
                embeds: [{
                    title: `Permissions insuffisantes`,
                    description: `Je ne peux pas m'auto bannir !`,
                    color: DiscordColor.Orange
                }],
                ephemeral: true
            });
            return false;
        };
        if (!member.bannable)
        {
            interaction.reply({
                embeds: [{
                    title: `Permissions insuffisantes`,
                    description: `Je n'ai pas la permission de bannir cette personne !`,
                    color: DiscordColor.Red
                }],
                ephemeral: true
            });
            return false;
        };
        const res = this.executorIsOverCible(member, executor)
        if (!res)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas bannir un membre qui est owner ou whitelist alors que vous non !`,
                        color: DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
            return false
        }
        if (res == 2)return true;
        if (this.cibleRoleIsBetter(member, executor))
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas bannir un membre avec un role supérieur ou égal au votre !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        return true;
    };

    memberMuteable(member: GuildMember, executor: GuildMember, interaction: CommandInteraction) {
        if (member.user.id == this.#client.user.id)
        {
            interaction.reply({
                embeds: [{
                    title: `Permissions insuffisantes`,
                    description: `Je ne peux pas m'auto mute !`,
                    color: DiscordColor.Orange
                }],
                ephemeral: true
            });
            return false;
        };
        if (member.permissions.has("Administrator"))
        {
            interaction.reply({
                embeds: [{
                    title: `Permission Administrateur`,
                    description: `Vous ne pouvez pas rendre muet un administateur !`,
                    color: DiscordColor.Orange
                }],
                ephemeral: true
            });
            return false;
        }
        if (!member.moderatable)
        {
            interaction.reply({
                embeds: [{
                    title: `Permissions insuffisantes`,
                    description: `Je n'ai pas la permission de mute cette personne !`,
                    color: DiscordColor.Red
                }],
                ephemeral: true
            });
            return false;
        };
        const res = this.executorIsOverCible(member, executor)
        if (!res)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas mute un membre qui est owner ou whitelist alors que vous non !`,
                        color: DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
            return false
        }
        if (res == 2)return true;
        if (this.cibleRoleIsBetter(member, executor))
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas mute un membre avec un role supérieur ou égal au votre !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        return true;
    };

    memberKicable(member: GuildMember, executor: GuildMember, interaction: CommandInteraction) {
        if (member.user.id == this.#client.user.id)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je ne peux pas m'auto expulser !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        if (!member.kickable)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je n'ai pas la permission d'expulser cette personne !`,
                        color: DiscordColor.Red
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        const res = this.executorIsOverCible(member, executor);
        if (!res)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre qui est owner ou whitelist alors que vous non !`,
                        color: DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
            return false
        }
        if (res == 2)return true
        if (this.cibleRoleIsBetter(member, executor))
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre avec un role supérieur ou égal au votre !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        return true;
    };

    memberVoiceKicable(member: GuildMember, executor: GuildMember, interaction) {
        if (member.user.id == this.#client.user.id)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je ne peux pas m'auto déconnecter !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        if (member.kickable)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je n'ai pas la permission de déconnecter cette personne !`,
                        color: DiscordColor.Red
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        if (!executor.permissions.has(PermissionsBitField.Flags.MoveMembers))
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous avez besoin de la permission \`Move_Members\` pour utiliser cette commande !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        const res = this.executorIsOverCible(member, executor)
        if (!res)
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre qui est owner ou whitelist alors que vous non !`,
                        color: DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
            return false
        }
        if (res == 2)return true;
        if (this.cibleRoleIsBetter(member, executor))
        {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre avec un role supérieur ou égal au votre !`,
                        color: DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        };
        return true;
    };

    async muteUser({userId, guildId, executor, time, raison}: {userId: string, guildId: string, executor: string, time: number, raison: string}) {
        const member = this.#client.guilds.cache.get(guildId).members.cache.get(userId);
        const role = await this.#checkMuteRole(guildId);
        member.roles.add(role).then(() => {
            this.#client.managers.muteManager.getAndCreateIfNotExists(`${member.id}-${guildId}`, {
                guildId: guildId,
                memberId: member.id,
                createdAt: new Date().getTime(),
                expiredAt: new Date().getTime() + time || null,
                reason: raison || "pas de raison",
                authorId: executor || "par le bot",
            }).save()
        }).catch(() => {});
    }

    #checkMuteRole(guildId): string | Promise<string> {
        let guildData = this.#client.managers.guildsManager.getAndCreateIfNotExists(guildId, {
            guildId: guildId,
        })
        if (guildData.muteRoleId) {
            if (this.#client.guilds.cache.get(guildId).roles.cache.has(guildData.muteRoleId))return guildData.muteRoleId;
        }
        if (this.#client.guilds.cache.get(guildId).roles.cache.find(x => x.name == "Mute")?.id) {
            guildData.muteRoleId = (this.#client.guilds.cache.get(guildId).roles.cache.find(x => x.name == "Mute").id);
            guildData.save()
            return guildData.muteRoleId;
        }

        return this.#client.guilds.cache.get(guildId).roles.create({
            name: "Mute",
            color: "#2e2d2d",
            position: 1000,
        }).then(role => {
            this.#client.guilds.cache.get(guildId).channels.cache.map(g => {
                if (!g.isThread()) {
                    g.permissionOverwrites.create(role.id, {
                        SendMessages: false,
                        AddReactions: false,
                        Speak: false,
                        Stream: false,
                    })
                }
                guildData.muteRoleId = role.id;
                guildData.save()
                return role.id
            });
        }).catch(() => {return null})
    };

    async applySanction(member: GuildMember, sanction, logChannelId, type) {
        switch (sanction) {
            case "ban" : {
                member.ban({reason: "Anti Raid"}).then(async () => {
                    if (!logChannelId)return;
                    //@ts-ignore
                    (await member.guild.channels.fetch(logChannelId)).send({
                        embeds: [
                            {
                                title: "Anti Raid - Bannissement",
                                description: `Le membre <@${member.id}> à été banni du serveur par l'anti raid\n\nRaison: \`${type}\``,
                                color: 14592837,
                            }
                        ]
                    });
                });
                member.user.send({
                            embeds: [
                                {
                                    title: `Vous avez été banni par l'anti raid du serveur ${member.guild.name} !\n\nRaison: \`${type}\``,
                                    color: 14592837,
                                }
                            ]
                    }).catch(() => {})
            }break;
            case "derank" : {
                member.roles.cache.map(role => {
                    member.roles.remove(role, "Anti Raid").catch(() => {})
                })
                if (!logChannelId)return;
                //@ts-ignore
                (await member.guild.channels.fetch(logChannelId)).send({
                    embeds: [
                        {
                            title: "Anti Raid - Derank",
                            description: `Le membre <@${member.id}> à été derank du serveur par l'anti raid\n\nRaison: \`${type}\``,
                            color: 14592837,
                        }
                    ]
                })
                member.user.send({
                            embeds: [
                                {
                                    title: `Vous avez été derank par l'anti raid du serveur ${member.guild.name} !\n\nRaison: \`${type}\``,
                                    color: 14592837,
                                }
                            ]
                    }).catch(() => {})
            }break;
            case "kick" : {
                member.kick("Anti Raid").then(async () => {
                    if (!logChannelId)return;
                    //@ts-ignore
                    (await member.guild.channels.fetch(logChannelId)).send({
                        embeds: [
                            {
                                title: "Anti Raid - Kick",
                                description: `Le membre <@${member.id}> à été kick du serveur par l'anti raid\n\nRaison: \`${type}\``,
                                color: 14592837,
                            }
                        ]
                    });
                });
                member.user.send({
                            embeds: [
                                {
                                    title: `Vous avez été kick par l'anti raid du serveur ${member.guild.name} !\n\nRaison: \`${type}\``,
                                    color: 14592837,
                                }
                            ]
                    }).catch(() => {})
            }break;
        }
    }
}