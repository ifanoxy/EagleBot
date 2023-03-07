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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "guildMemberAdd",
    execute(client, member) {
        var _a, _b, _c, _d;
        if ((_a = member.user) === null || _a === void 0 ? void 0 : _a.bot) {
            const logChannel = client.func.log.isActive(member.guild.id, "botAdd");
            if (logChannel)
                this.botAdd(member, logChannel);
        }
        if (client.isBlacklist(member.id))
            member.ban({ reason: "Blacklist" }).catch();
        const guildData = client.managers.guildsManager.getIfExist(member.guild.id);
        if (!guildData)
            return;
        if (((_b = guildData === null || guildData === void 0 ? void 0 : guildData.autoroles) === null || _b === void 0 ? void 0 : _b.length) != 0)
            this.autoroles(member, guildData.autoroles);
        if ((_c = guildData === null || guildData === void 0 ? void 0 : guildData.greetPing) === null || _c === void 0 ? void 0 : _c.status)
            this.greetPing(member, guildData.greetPing);
        if ((_d = guildData === null || guildData === void 0 ? void 0 : guildData.join) === null || _d === void 0 ? void 0 : _d.channelId)
            client.func.mod.sendJoinMessage(member.guild.id, member);
    },
    greetPing(member, Data) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let channel of Data.channels) {
                (yield member.guild.channels.fetch(channel)).send(`<@${member.id}>`).then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 200);
                });
            }
        });
    },
    autoroles(member, roles) {
        member.roles.add(roles).catch(() => { });
    },
    botAdd(member, channel) {
        member.guild.fetchAuditLogs({
            limit: 1,
            type: discord_js_1.AuditLogEvent.BotAdd,
        }).then(audit => {
            var _a, _b;
            channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | Bot Add`)
                        .setThumbnail(member.avatarURL())
                        .setDescription(`**Bot ID:** <@${member.id}> (${member.id})\n\n` +
                        `**Ajouté par:** <@${(_b = (_a = audit.entries.first()) === null || _a === void 0 ? void 0 : _a.executor) === null || _b === void 0 ? void 0 : _b.id}>`)
                ]
            });
        });
    }
};
