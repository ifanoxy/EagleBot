import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, Invite} from "discord.js";

export default {
    name: "inviteDelete",
    execute(client: EagleClient, invite: Invite) {
        const channel = client.func.log.isActive(invite.guild.id, "InviteCreate");
        if (!channel)return;
        invite.guild.fetch().then(guild => guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.InviteDelete,
        }).then(audit => {
            channel.send({
                embeds: [
                    new EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(
                            `**Code:** ${invite.code}\n\n` +
                            `**Supprimée par:** <@${audit.entries.first().executor.id}>`
                        )
                ]
            });
        }));
    }
}