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
    name: "guildMemberUpdate",
    execute(client, oldMember, newMember) {
        return __awaiter(this, void 0, void 0, function* () {
            const channelLog = client.func.log.isActive(newMember.guild.id, "AdminRolesAdd");
            if (channelLog)
                this.AdminRolesAdd(client, oldMember, newMember, channelLog);
        });
    },
    AdminRolesAdd(client, oldMember, newMember, channel) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (newMember.roles.cache.size < oldMember.roles.cache.size)
                return;
            const roleAdded = newMember.roles.cache.difference(oldMember.roles.cache);
            if (!roleAdded.first().permissions.has(discord_js_1.PermissionsBitField.Flags.Administrator))
                return;
            const audit = yield newMember.guild.fetchAuditLogs({
                limit: 1,
                type: discord_js_1.AuditLogEvent.MemberRoleUpdate
            });
            channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | Admin Role Add`)
                        .setThumbnail(newMember.avatarURL())
                        .setDescription(`**Utilisateur ID:** <@${newMember.id}> (${newMember.id})\n\n` +
                        `**Role:** <@&${roleAdded.first().id}>\n\n` +
                        `**Ajouté par:** <@${(_b = (_a = audit.entries.first()) === null || _a === void 0 ? void 0 : _a.executor) === null || _b === void 0 ? void 0 : _b.id}>`)
                ]
            });
        });
    }
};
