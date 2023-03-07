"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "guildMemberRemove",
    execute(client, member) {
        const kickChannel = client.func.log.isActive(member.guild.id, "MemberKick");
        if (kickChannel)
            this.kickLog(client, member, kickChannel);
        const guildData = client.managers.guildsManager.getIfExist(member.guild.id);
        if (!guildData)
            return;
        if (guildData.leave.channelId)
            client.func.mod.sendLeaveMessage(member.guild.id, member);
    },
    kickLog(client, member, channel) {
        member.guild.fetchAuditLogs({
            limit: 1,
            type: discord_js_1.AuditLogEvent.MemberKick,
        }).then(audit => {
            channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | Member Kick `)
                        .setDescription(`**Membre:** <@${member.user.id}>\n\n` +
                        `**Raison** ${audit.entries.first().reason || "Pas de raison"}\n\n` +
                        `**Kick par:** <@${audit.entries.first().executor.id}>`)
                ]
            });
        });
    },
};
