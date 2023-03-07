"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Moderation_instances, _Moderation_client, _Moderation_checkMuteRole;
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = require("../structures/Enumerations/Embed");
class Moderation {
    constructor(client) {
        _Moderation_instances.add(this);
        _Moderation_client.set(this, void 0);
        __classPrivateFieldSet(this, _Moderation_client, client, "f");
    }
    sendJoinMessage(guildId, member) {
        var _a;
        let guildData = __classPrivateFieldGet(this, _Moderation_client, "f").managers.guildsManager.getIfExist(guildId);
        if (!guildData)
            return;
        const channel = __classPrivateFieldGet(this, _Moderation_client, "f").guilds.cache.get(guildId).channels.cache.get((_a = guildData.join) === null || _a === void 0 ? void 0 : _a.channelId);
        if (!channel) {
            guildData.join = { channelId: null, message: { content: null, embed: null } };
            guildData.save();
            return;
        }
        let content = guildData.join.message.content;
        let embed = guildData.join.message.embed;
        const find = ["{member-name}", "{member-tag}", "{member-id}", "{member-mention}", "{member-avatar}", "{member-age}"];
        const replace = [member.user.username, member.user.tag, member.id, `<@${member.id}>`, member.user.avatarURL(), `<t:${Math.round(member.user.createdTimestamp / 1000)}>`];
        if (content) {
            content = content.replaceArray(find, replace);
        }
        if (embed) {
            embed = JSON.parse(JSON.stringify(embed).replaceArray(find, replace));
        }
        if (content && embed) { // @ts-ignore
            return channel.send({
                content: content,
                embeds: [embed]
            });
        }
        else if (content) { // @ts-ignore
            return channel.send({
                content: content
            });
        }
        else { // @ts-ignore
            return channel.send({
                embeds: [embed]
            });
        }
    }
    ;
    sendLeaveMessage(guildId, member) {
        var _a;
        let guildData = __classPrivateFieldGet(this, _Moderation_client, "f").managers.guildsManager.getIfExist(guildId);
        if (!guildData)
            return;
        const channel = __classPrivateFieldGet(this, _Moderation_client, "f").guilds.cache.get(guildId).channels.cache.get((_a = guildData.leave) === null || _a === void 0 ? void 0 : _a.channelId);
        if (!channel) {
            guildData.leave = { channelId: null, message: { content: null, embed: null } };
            guildData.save();
            return;
        }
        let content = guildData.leave.message.content;
        let embed = guildData.leave.message.embed;
        const find = ["{member-name}", "{member-tag}", "{member-id}", "{member-mention}", "{member-avatar}", "{member-age}"];
        const replace = [member.user.username, member.user.tag, member.id, `<@${member.id}>`, member.user.avatarURL(), `<t:${Math.round(member.user.createdTimestamp / 1000)}>`];
        if (content) {
            content = content.replaceArray(find, replace);
        }
        if (embed) {
            embed = JSON.parse(JSON.stringify(embed).replaceArray(find, replace));
        }
        if (content && embed) { // @ts-ignore
            return channel.send({
                content: content,
                embeds: [embed]
            });
        }
        else if (content) { // @ts-ignore
            return channel.send({
                content: content
            });
        }
        else { // @ts-ignore
            return channel.send({
                embeds: [embed]
            });
        }
    }
    cibleRoleIsBetter(cible, executor) {
        if (cible.roles.highest.rawPosition >= executor.roles.highest.rawPosition)
            return true;
        else
            return false;
    }
    ;
    executorIsOverCible(cible, executor) {
        const cibleWL = __classPrivateFieldGet(this, _Moderation_client, "f").isWhitelist(cible.id);
        const executorWL = __classPrivateFieldGet(this, _Moderation_client, "f").isWhitelist(executor.id);
        if (!cibleWL && executorWL)
            return 2;
        if (cibleWL && !executorWL)
            return null;
        if (!cibleWL && !executorWL)
            return 1;
        const cibleOwner = __classPrivateFieldGet(this, _Moderation_client, "f").isOwner(cible.id);
        const executorOwner = __classPrivateFieldGet(this, _Moderation_client, "f").isOwner(executor.id);
        if (!cibleOwner && executorOwner)
            return 2;
        if (cibleOwner && !executorOwner)
            return null;
        return 1;
    }
    ;
    memberBannable(member, executor, interaction) {
        if (member.user.id == __classPrivateFieldGet(this, _Moderation_client, "f").user.id) {
            interaction.reply({
                embeds: [{
                        title: `Permissions insuffisantes`,
                        description: `Je ne peux pas m'auto bannir !`,
                        color: Embed_1.DiscordColor.Orange
                    }],
                ephemeral: true
            });
            return false;
        }
        ;
        if (!member.bannable) {
            interaction.reply({
                embeds: [{
                        title: `Permissions insuffisantes`,
                        description: `Je n'ai pas la permission de bannir cette personne !`,
                        color: Embed_1.DiscordColor.Red
                    }],
                ephemeral: true
            });
            return false;
        }
        ;
        const res = this.executorIsOverCible(member, executor);
        if (!res) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas bannir un membre qui est owner ou whitelist alors que vous non !`,
                        color: Embed_1.DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        if (res == 2)
            return true;
        if (this.cibleRoleIsBetter(member, executor)) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas bannir un membre avec un role supérieur ou égal au votre !`,
                        color: Embed_1.DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        ;
        return true;
    }
    ;
    memberMuteable(member, executor, interaction) {
        if (member.user.id == __classPrivateFieldGet(this, _Moderation_client, "f").user.id) {
            interaction.reply({
                embeds: [{
                        title: `Permissions insuffisantes`,
                        description: `Je ne peux pas m'auto mute !`,
                        color: Embed_1.DiscordColor.Orange
                    }],
                ephemeral: true
            });
            return false;
        }
        ;
        if (member.permissions.has("Administrator")) {
            interaction.reply({
                embeds: [{
                        title: `Permission Administrateur`,
                        description: `Vous ne pouvez pas rendre muet un administateur !`,
                        color: Embed_1.DiscordColor.Orange
                    }],
                ephemeral: true
            });
            return false;
        }
        if (!member.moderatable) {
            interaction.reply({
                embeds: [{
                        title: `Permissions insuffisantes`,
                        description: `Je n'ai pas la permission de mute cette personne !`,
                        color: Embed_1.DiscordColor.Red
                    }],
                ephemeral: true
            });
            return false;
        }
        ;
        const res = this.executorIsOverCible(member, executor);
        if (!res) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas mute un membre qui est owner ou whitelist alors que vous non !`,
                        color: Embed_1.DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        if (res == 2)
            return true;
        if (this.cibleRoleIsBetter(member, executor)) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas mute un membre avec un role supérieur ou égal au votre !`,
                        color: Embed_1.DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        ;
        return true;
    }
    ;
    memberKicable(member, executor, interaction) {
        if (member.user.id == __classPrivateFieldGet(this, _Moderation_client, "f").user.id) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je ne peux pas m'auto expulser !`,
                        color: Embed_1.DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        ;
        if (!member.kickable) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je n'ai pas la permission d'expulser cette personne !`,
                        color: Embed_1.DiscordColor.Red
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        const res = this.executorIsOverCible(member, executor);
        if (!res) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre qui est owner ou whitelist alors que vous non !`,
                        color: Embed_1.DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        if (res == 2)
            return true;
        if (this.cibleRoleIsBetter(member, executor)) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre avec un role supérieur ou égal au votre !`,
                        color: Embed_1.DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        ;
        return true;
    }
    ;
    memberVoiceKicable(member, executor, interaction) {
        if (member.user.id == __classPrivateFieldGet(this, _Moderation_client, "f").user.id) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je ne peux pas m'auto déconnecter !`,
                        color: Embed_1.DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        ;
        if (member.kickable) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Je n'ai pas la permission de déconnecter cette personne !`,
                        color: Embed_1.DiscordColor.Red
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        if (!executor.permissions.has(discord_js_1.PermissionsBitField.Flags.MoveMembers)) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous avez besoin de la permission \`Move_Members\` pour utiliser cette commande !`,
                        color: Embed_1.DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        ;
        const res = this.executorIsOverCible(member, executor);
        if (!res) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre qui est owner ou whitelist alors que vous non !`,
                        color: Embed_1.DiscordColor.DarkPurple
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        if (res == 2)
            return true;
        if (this.cibleRoleIsBetter(member, executor)) {
            interaction.reply({
                embeds: [
                    {
                        title: `Permissions insuffisantes`,
                        description: `Vous ne pouvez pas expulser un membre avec un role supérieur ou égal au votre !`,
                        color: Embed_1.DiscordColor.Orange
                    }
                ],
                ephemeral: true
            });
            return false;
        }
        ;
        return true;
    }
    ;
    muteUser({ userId, guildId, executor, time, raison }) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = __classPrivateFieldGet(this, _Moderation_client, "f").guilds.cache.get(guildId).members.cache.get(userId);
            const role = yield __classPrivateFieldGet(this, _Moderation_instances, "m", _Moderation_checkMuteRole).call(this, guildId);
            member.roles.add(role).then(() => {
                __classPrivateFieldGet(this, _Moderation_client, "f").managers.muteManager.getAndCreateIfNotExists(`${member.id}-${guildId}`, {
                    guildId: guildId,
                    memberId: member.id,
                    createdAt: new Date().getTime(),
                    expiredAt: new Date().getTime() + time || null,
                    reason: raison || "pas de raison",
                    authorId: executor || "par le bot",
                }).save();
            }).catch(() => { });
        });
    }
    ;
    applySanction(member, sanction, logChannelId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (sanction) {
                case "ban":
                    {
                        member.ban({ reason: "Anti Raid" }).then(() => __awaiter(this, void 0, void 0, function* () {
                            if (!logChannelId)
                                return;
                            //@ts-ignore
                            (yield member.guild.channels.fetch(logChannelId)).send({
                                embeds: [
                                    {
                                        title: "Anti Raid - Bannissement",
                                        description: `Le membre <@${member.id}> à été banni du serveur par l'anti raid\n\nRaison: \`${type}\``,
                                        color: 14592837,
                                    }
                                ]
                            });
                        }));
                        member.user.send({
                            embeds: [
                                {
                                    title: `Vous avez été banni par l'anti raid du serveur ${member.guild.name} !\n\nRaison: \`${type}\``,
                                    color: 14592837,
                                }
                            ]
                        }).catch(() => { });
                    }
                    break;
                case "derank":
                    {
                        member.roles.cache.map(role => {
                            member.roles.remove(role, "Anti Raid").catch(() => { });
                        });
                        if (!logChannelId)
                            return;
                        //@ts-ignore
                        (yield member.guild.channels.fetch(logChannelId)).send({
                            embeds: [
                                {
                                    title: "Anti Raid - Derank",
                                    description: `Le membre <@${member.id}> à été derank du serveur par l'anti raid\n\nRaison: \`${type}\``,
                                    color: 14592837,
                                }
                            ]
                        });
                        member.user.send({
                            embeds: [
                                {
                                    title: `Vous avez été derank par l'anti raid du serveur ${member.guild.name} !\n\nRaison: \`${type}\``,
                                    color: 14592837,
                                }
                            ]
                        }).catch(() => { });
                    }
                    break;
                case "kick":
                    {
                        member.kick("Anti Raid").then(() => __awaiter(this, void 0, void 0, function* () {
                            if (!logChannelId)
                                return;
                            //@ts-ignore
                            (yield member.guild.channels.fetch(logChannelId)).send({
                                embeds: [
                                    {
                                        title: "Anti Raid - Kick",
                                        description: `Le membre <@${member.id}> à été kick du serveur par l'anti raid\n\nRaison: \`${type}\``,
                                        color: 14592837,
                                    }
                                ]
                            });
                        }));
                        member.user.send({
                            embeds: [
                                {
                                    title: `Vous avez été kick par l'anti raid du serveur ${member.guild.name} !\n\nRaison: \`${type}\``,
                                    color: 14592837,
                                }
                            ]
                        }).catch(() => { });
                    }
                    break;
            }
        });
    }
}
exports.default = Moderation;
_Moderation_client = new WeakMap(), _Moderation_instances = new WeakSet(), _Moderation_checkMuteRole = function _Moderation_checkMuteRole(guildId) {
    var _a;
    let guildData = __classPrivateFieldGet(this, _Moderation_client, "f").managers.guildsManager.getAndCreateIfNotExists(guildId, {
        guildId: guildId,
    });
    if (guildData.muteRoleId) {
        if (__classPrivateFieldGet(this, _Moderation_client, "f").guilds.cache.get(guildId).roles.cache.has(guildData.muteRoleId))
            return guildData.muteRoleId;
    }
    if ((_a = __classPrivateFieldGet(this, _Moderation_client, "f").guilds.cache.get(guildId).roles.cache.find(x => x.name == "Mute")) === null || _a === void 0 ? void 0 : _a.id) {
        guildData.muteRoleId = (__classPrivateFieldGet(this, _Moderation_client, "f").guilds.cache.get(guildId).roles.cache.find(x => x.name == "Mute").id);
        guildData.save();
        return guildData.muteRoleId;
    }
    return __classPrivateFieldGet(this, _Moderation_client, "f").guilds.cache.get(guildId).roles.create({
        name: "Mute",
        color: "#2e2d2d",
        position: 1000,
    }).then(role => {
        __classPrivateFieldGet(this, _Moderation_client, "f").guilds.cache.get(guildId).channels.cache.map(g => {
            if (!g.isThread()) {
                g.permissionOverwrites.create(role.id, {
                    SendMessages: false,
                    AddReactions: false,
                    Speak: false,
                    Stream: false,
                });
            }
            guildData.muteRoleId = role.id;
            guildData.save();
            return role.id;
        });
    }).catch(() => { return null; });
};
