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
    name: "channelPinsUpdate",
    execute(client, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            if (channel.isVoiceBased() || channel.isDMBased())
                return;
            const auditPinAdd = (yield channel.guild.fetchAuditLogs({
                type: discord_js_1.AuditLogEvent.MessagePin,
                limit: 1
            })).entries.first();
            const auditPinRemove = (yield channel.guild.fetchAuditLogs({
                type: discord_js_1.AuditLogEvent.MessageUnpin,
                limit: 1
            })).entries.first();
            if (auditPinAdd.createdTimestamp > auditPinRemove.createdTimestamp)
                yield this.pinAdd(client, channel, auditPinAdd);
            else
                yield this.pinRemove(client, channel, auditPinRemove);
        });
    },
    pinAdd(client, channel, audit) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelSend = client.func.log.isActive(channel.guild.id, "MessagePin");
            if (!channelSend)
                return;
            channelSend.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(`**Pin par :** <@${audit.executor.id}>\n\n` +
                        `**Lien vers le message :** ${(yield channel.messages.fetch(audit.extra.messageId)).url}\n\n` +
                        `**Contenu du message :**\n\`\`\`${(yield channel.messages.fetch(audit.extra.messageId)).content || "ne contient pas de texte"}\`\`\``)
                ]
            });
        });
    },
    pinRemove(client, channel, audit) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelSend = client.func.log.isActive(channel.guild.id, "MessageUnpin");
            if (!channelSend)
                return;
            channelSend.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(`**unPin par :** <@${audit.executor.id}>\n\n` +
                        `**Lien vers le message :** ${(yield channel.messages.fetch(audit.extra.messageId)).url}\n\n` +
                        `**Contenu du message :**\n\`\`\`${(yield channel.messages.fetch(audit.extra.messageId)).content || "ne contient pas de texte"}\`\`\``)
                ]
            });
        });
    },
};
