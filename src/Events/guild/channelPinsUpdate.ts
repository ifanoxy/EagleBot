import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, ChannelType, EmbedBuilder, TextBasedChannel} from "discord.js";

export default {
    name: "channelPinsUpdate",
    async execute(client: EagleClient, channel: TextBasedChannel, time) {
        if (channel.isVoiceBased() || channel.isDMBased())return;
        const auditPinAdd = (await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.MessagePin,
            limit: 1
        })).entries.first();
        const auditPinRemove = (await channel.guild.fetchAuditLogs({
            type: AuditLogEvent.MessageUnpin,
            limit: 1
        })).entries.first();
        if (auditPinAdd.createdTimestamp > auditPinRemove.createdTimestamp) await this.pinAdd(client, channel, auditPinAdd);
        else await this.pinRemove(client, channel, auditPinRemove)
    },
    async pinAdd(client: EagleClient, channel, audit) {
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Pin par :** <@${audit.executor.id}>\n\n`+
                        `**Contenu du message :**\n\`\`\`${await channel.messages.fetch(audit.extra.messageId).content}\`\`\``
                    )
            ]
        });
    },
    async pinRemove(client: EagleClient, channel, audit) {
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**unPin par :** <@${audit.executor.id}>\n\n`+
                        `**Contenu du message :**\n\`\`\`${await channel.messages.fetch(audit.extra.messageId).content}\`\`\``
                    )
            ]
        });
    },
}