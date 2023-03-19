import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildMember, PermissionsBitField} from "discord.js";

export default {
    name: "guildMemberUpdate",
    async execute(client: EagleClient, oldMember: GuildMember, newMember: GuildMember) {
        const channelLog = client.func.log.isActive(newMember.guild.id, "AdminRolesAdd");
        if (channelLog) this.AdminRolesAdd(client, oldMember, newMember, channelLog)
    },

    async AdminRolesAdd(client: EagleClient, oldMember: GuildMember, newMember: GuildMember, channel) {
        if (newMember.roles.cache.size <= oldMember.roles.cache.size)return;
        const roleAdded = newMember.roles.cache.difference(oldMember.roles.cache);
        if (!roleAdded.first().permissions.has(PermissionsBitField.Flags.Administrator))return;
        const audit = await newMember.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberRoleUpdate
        });
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Admin Role Add`)
                    .setThumbnail(newMember.avatarURL())
                    .setDescription(
                        `**Utilisateur ID:** <@${newMember.id}> (${newMember.id})\n\n` +
                        `**Role:** <@&${roleAdded.first().id}>\n\n` +
                        `**Ajouté par:** <@${audit.entries.first()?.executor?.id}>`
                    )
            ]
        })
    }
}