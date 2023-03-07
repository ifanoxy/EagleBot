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
    name: "stickerDelete",
    execute(client, sticker) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = client.func.log.isActive(sticker.guildId, "StickerDelete");
            if (!channel)
                return;
            const audit = yield sticker.guild.fetchAuditLogs({
                limit: 1,
                type: discord_js_1.AuditLogEvent.StickerDelete,
            });
            channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(`**Nom:** ${sticker.name}\n\n` +
                        `**ID:** ${sticker.id}\n\n` +
                        `**Description:** ${sticker.description || 'aucune'}\n\n` +
                        `**Supprimé par:** <@${audit.entries.first().executor.id}>`)
                        .setImage(sticker.url)
                ],
            });
        });
    }
};
