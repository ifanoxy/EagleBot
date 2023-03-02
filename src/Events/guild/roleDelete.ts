import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, Role} from "discord.js";

export default {
    name: "roleDelete",
    async execute(client: EagleClient, role: Role) {
        const channel = client.func.log.isActive(role.guild.id, "RoleDelete");
        if (!channel)return;

        const audit = (await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleDelete,
        })).entries.first()

        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Nom:** <@#${role.name}>\n\n`+
                        `**Id:** <@#${role.id}>\n\n`+
                        `**Supprimé par:** <@${audit.executor.id}>`
                    )
            ]
        });
    }
}