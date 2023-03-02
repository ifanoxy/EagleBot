import {EagleClient} from "../../structures/Client";
import {
    AuditLogEvent,
    EmbedBuilder,
    ForumChannel,
    NewsChannel, StageChannel,
    TextChannel,
    VoiceChannel,
    Webhook
} from "discord.js";

export default {
    name: "webhookUpdate",
    async execute(client: EagleClient, channel: TextChannel | NewsChannel | VoiceChannel | StageChannel | ForumChannel) {
        const auditWebhookCreate = (await (await client.guilds.fetch(channel.guildId)).fetchAuditLogs({
            type: AuditLogEvent.WebhookCreate,
            limit: 1
        })).entries.first();
        const auditWebhookDelete = (await (await client.guilds.fetch(channel.guildId)).fetchAuditLogs({
            type: AuditLogEvent.WebhookDelete,
            limit: 1
        })).entries.first();
        if (auditWebhookCreate.createdTimestamp > auditWebhookDelete.createdTimestamp) await this.webhookCreate(client, channel, auditWebhookCreate);
        else await this.webhookDelete(client, channel, auditWebhookDelete)
    },

    webhookCreate(client: EagleClient, chn, audit) {
        const channel = client.func.log.isActive(chn.guildId, "WebhookCreate");
        if (!channel)return;
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Nom:** ${audit.target.name}\n\n`+
                        `**ID:** ${audit.target.id}\n\n`+
                        `**Channel:** <#${chn.id}>\n\n`+
                        `**Créé par:** <@${audit.executor.id}>\n\n`
                    )
            ],
        });
    },

    webhookDelete(client: EagleClient, chn, audit) {
        const channel = client.func.log.isActive(chn.guildId, "WebhookDelete");
        if (!channel)return;
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Nom:** ${audit.target.name}\n\n`+
                        `**ID:** ${audit.target.id}\n\n`+
                        `**Channel:** <#${chn.id}>\n\n`+
                        `**Supprimé par:** <@${audit.executor.id}>\n\n`
                    )
            ],
        });
    }
}