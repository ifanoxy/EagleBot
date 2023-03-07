"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "guildBanAdd",
    execute(client, member) {
        const channel = client.func.log.isActive(member.guild.id, "MemberBanAdd");
        if (!channel)
            return;
        member.guild.fetchAuditLogs({
            limit: 1,
            type: discord_js_1.AuditLogEvent.MemberBanAdd,
        }).then(audit => {
            channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(`**Membre:** <@${member.user.id}>\n\n` +
                        `**Raison** ${member.reason || "Pas de raison"}\n\n` +
                        `**Banni par:** <@${audit.entries.first().executor.id}>`)
                ]
            });
        });
    }
};
