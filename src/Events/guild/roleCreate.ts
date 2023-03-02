import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, Role} from "discord.js";

export default {
    name: "roleCreate",
    async execute(client: EagleClient, role: Role) {
        const channel = client.func.log.isActive(role.guild.id, "RoleCreate");
        if (!channel)return;
        const audit = (await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleCreate,
        })).entries.first()
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Role:** <@#${role.id}>\n\n`+
                        `**Couleur Hexa** ${role.hexColor}\n\n`+
                        `**Permissions bitField:** ${role.permissions.bitfield}\n\n`+
                        `**Créé par:** <@${audit.executor.id}>`
                    )
            ]
        });
    }
}