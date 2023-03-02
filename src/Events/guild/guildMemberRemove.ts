import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildChannel, GuildMember} from "discord.js";

export default {
    name: "guildMemberRemove",
    execute(client: EagleClient, member: GuildMember) {
        const kickChannel = client.func.log.isActive(member.guild.id, "MemberKick");
        if (kickChannel) this.kickLog(client, member, kickChannel);
    },
    kickLog(client: EagleClient, member: GuildMember, channel) {
        member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick,
        }).then(audit => {
            channel.send({
                embeds: [
                    new EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | Member Kick `)
                        .setDescription(
                            `**Membre:** <@${member.user.id}>\n\n`+
                            `**Raison** ${audit.entries.first().reason || "Pas de raison"}\n\n`+
                            `**Kick par:** <@${audit.entries.first().executor.id}>`
                        )
                ]
            });
        });
    },
}