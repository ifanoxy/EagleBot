import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildMember} from "discord.js";

export default {
    name: "guildMemberAdd",
    execute(client: EagleClient, member: GuildMember) {
        if (!member.user?.bot)return;
        const channel = client.func.log.isActive(member.guild.id, "botAdd");
        if (!channel)
        member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.BotAdd,
        }).then(audit => {
            channel.send({
                embeds: [
                    new EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | Bot Add`)
                        .setThumbnail(member.avatarURL())
                        .setDescription(
                            `**Bot ID:** <@${member.id}> (${member.id})\n\n` +
                            `**Ajouté par:** <@${audit.entries.first()?.executor?.id}>`
                        )
                ]
            });
        });
    }
}