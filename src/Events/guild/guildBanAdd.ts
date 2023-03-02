import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildBan} from "discord.js";

export default {
    name: "guildBanAdd",
    execute(client: EagleClient, member: GuildBan) {
        const channel = client.func.log.isActive(member.guild.id, "MemberBanAdd");
        if (!channel)return;
        member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd,
        }).then(audit => {
            channel.send({
                embeds: [
                    new EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(
                            `**Membre:** <@${member.user.id}>\n\n` +
                            `**Raison** ${member.reason || "Pas de raison"}\n\n` +
                            `**Banni par:** <@${audit.entries.first().executor.id}>`
                        )
                ]
            });
        });
    }
}