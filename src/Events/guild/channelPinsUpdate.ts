import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, ChannelType, EmbedBuilder, TextBasedChannel} from "discord.js";

export default {
    name: "channelPinsUpdate",
    async execute(client: EagleClient, channel: TextBasedChannel) {
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
        const channelSend = client.func.log.isActive(channel.guild.id, "MessagePin");
        if (!channelSend)return;
        channelSend.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Pin par :** <@${audit.executor.id}>\n\n`+
                        `**Lien vers le message :** ${(await channel.messages.fetch(audit.extra.messageId)).url}\n\n`+
                        `**Contenu du message :**\n\`\`\`${(await channel.messages.fetch(audit.extra.messageId)).content || "ne contient pas de texte"}\`\`\``
                    )
            ]
        });
    },
    async pinRemove(client: EagleClient, channel, audit) {
        const channelSend = client.func.log.isActive(channel.guild.id, "MessageUnpin");
        if (!channelSend)return;
        channelSend.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**unPin par :** <@${audit.executor.id}>\n\n`+
                        `**Lien vers le message :** ${(await channel.messages.fetch(audit.extra.messageId)).url}\n\n`+
                        `**Contenu du message :**\n\`\`\`${(await channel.messages.fetch(audit.extra.messageId)).content || "ne contient pas de texte"}\`\`\``
                    )
            ]
        });
    },
}