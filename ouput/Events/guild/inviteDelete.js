"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "inviteDelete",
    execute(client, invite) {
        const channel = client.func.log.isActive(invite.guild.id, "InviteCreate");
        if (!channel)
            return;
        invite.guild.fetch().then(guild => guild.fetchAuditLogs({
            limit: 1,
            type: discord_js_1.AuditLogEvent.InviteDelete,
        }).then(audit => {
            channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(`**Code:** ${invite.code}\n\n` +
                        `**Supprimée par:** <@${audit.entries.first().executor.id}>`)
                ]
            });
        }));
    }
};
