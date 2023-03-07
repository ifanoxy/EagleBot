"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
    name: "channelDelete",
    execute(client, channel) {
        var _a, _b;
        const AntiraidData = client.managers.antiraidManager.getIfExist(channel.guildId);
        if (!((_b = (_a = AntiraidData === null || AntiraidData === void 0 ? void 0 : AntiraidData.status["anti-massChannel"]) === null || _a === void 0 ? void 0 : _a.delete) === null || _b === void 0 ? void 0 : _b.status))
            this.antiraid(AntiraidData, channel, client);
        const channelSend = client.func.log.isActive(channel.guildId, "channelDelete");
        if (!channelSend)
            return;
        let type;
        switch (channel.type) {
            case discord_js_1.ChannelType.GuildAnnouncement:
                {
                    type = "Channel d'annonce";
                }
                break;
            case discord_js_1.ChannelType.AnnouncementThread:
                {
                    type = "Thread channel d'annonce";
                }
                break;
            case discord_js_1.ChannelType.GuildCategory:
                {
                    type = "Categorie";
                }
                break;
            case discord_js_1.ChannelType.GuildForum:
                {
                    type = "Forum";
                }
                break;
            case discord_js_1.ChannelType.GuildStageVoice:
                {
                    type = "Channel de réunion";
                }
                break;
            case discord_js_1.ChannelType.GuildText:
                {
                    type = "Channel Textuel";
                }
                break;
            case discord_js_1.ChannelType.GuildVoice:
                {
                    type = "Channel vocal";
                }
                break;
            case discord_js_1.ChannelType.GuildNews:
                {
                    type = "Thread Public";
                }
                break;
            case discord_js_1.ChannelType.GuildPublicThread:
                {
                    type = "Thread Public";
                }
                break;
            case discord_js_1.ChannelType.GuildPrivateThread:
                {
                    type = "Thread Privé";
                }
                break;
        }
        channel.guild.fetchAuditLogs({
            limit: 1,
            type: discord_js_1.AuditLogEvent.ChannelDelete,
        }).then(audit => {
            var _a;
            channelSend.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(`**Nom:** ${channel.name}\n\n` +
                        `**Type:** ${type}\n\n` +
                        `**Catégorie:** <#${channel.parentId || "Aucune"}>\n\n` +
                        `**Supprimé par:** <@${(_a = audit.entries.first()) === null || _a === void 0 ? void 0 : _a.executor.id}>`)
                ]
            });
        });
    },
    antiraid(AntiraidData, channel, client) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const AuditLog = yield channel.guild.fetchAuditLogs({ limit: 1, type: discord_js_1.AuditLogEvent.ChannelDelete });
            const userId = AuditLog.entries[0].user.id;
            if (client.isOwner(userId))
                return;
            if (AntiraidData.status["anti-massChannel"].delete.ignoreWhitelist) {
                if (client.isWhitelist(userId))
                    return;
            }
            const maxfrequence = Number(AntiraidData.status["anti-massChannel"].delete.frequence.split('/')[0]);
            try {
                var frequenceData = (_a = `../frequence/${userId}.json`, Promise.resolve().then(() => __importStar(require(_a))));
            }
            catch (_b) {
                var frequenceData = {};
            }
            if (((frequenceData === null || frequenceData === void 0 ? void 0 : frequenceData.channelDelete) || 0) < maxfrequence - 1) {
                frequenceData.channelDelete = ((frequenceData === null || frequenceData === void 0 ? void 0 : frequenceData.channelDelete) || 0) + 1;
                client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                setTimeout(() => {
                    try {
                        frequenceData.channelDelete -= 1;
                        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                    }
                    catch (_a) { }
                }, (Number(AntiraidData.status["anti-massChannel"].delete.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massChannel"].delete.frequence.split('/')[1].length - 1)) * 1000));
                return;
            }
            const member = yield channel.guild.members.fetch(userId);
            yield client.func.mod.applySanction(member[0], AntiraidData.status["anti-massChannel"].delete.sanction, AntiraidData, "Mass Channel Delete");
            frequenceData === null || frequenceData === void 0 ? true : delete frequenceData.channelDelete;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
        });
    }
};
