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
    name: "webhookUpdate",
    execute(client, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const auditWebhookCreate = (yield (yield client.guilds.fetch(channel.guildId)).fetchAuditLogs({
                type: discord_js_1.AuditLogEvent.WebhookCreate,
                limit: 1
            })).entries.first();
            const auditWebhookDelete = (yield (yield client.guilds.fetch(channel.guildId)).fetchAuditLogs({
                type: discord_js_1.AuditLogEvent.WebhookDelete,
                limit: 1
            })).entries.first();
            if (auditWebhookCreate.createdTimestamp > auditWebhookDelete.createdTimestamp)
                yield this.webhookCreate(client, channel, auditWebhookCreate);
            else
                yield this.webhookDelete(client, channel, auditWebhookDelete);
        });
    },
    webhookCreate(client, chn, audit) {
        const channel = client.func.log.isActive(chn.guildId, "WebhookCreate");
        if (!channel)
            return;
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(`**Nom:** ${audit.target.name}\n\n` +
                    `**ID:** ${audit.target.id}\n\n` +
                    `**Channel:** <#${chn.id}>\n\n` +
                    `**Créé par:** <@${audit.executor.id}>\n\n`)
            ],
        });
    },
    webhookDelete(client, chn, audit) {
        const channel = client.func.log.isActive(chn.guildId, "WebhookDelete");
        if (!channel)
            return;
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(`**Nom:** ${audit.target.name}\n\n` +
                    `**ID:** ${audit.target.id}\n\n` +
                    `**Channel:** <#${chn.id}>\n\n` +
                    `**Supprimé par:** <@${audit.executor.id}>\n\n`)
            ],
        });
    }
};
