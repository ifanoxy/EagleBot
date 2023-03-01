import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, Invite} from "discord.js";

export default {
    name: "inviteCreate",
    execute(client: EagleClient, invite: Invite) {
        const channel = client.func.log.isActive(invite.guild.id, "InviteCreate");
        if (!channel)return;
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Code:** ${invite.code}\n\n` +
                        `**Expire** <t:${Math.round(invite.expiresTimestamp / 1000)}:R>\n\n` +
                        `**Nombre d'utilisations maximum:** ${invite.maxUses}\n\n` +
                        `**Créée par:** <@${invite.inviterId}>`
                    )
            ]
        });
    }
}