import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, ChannelType, EmbedBuilder, ThreadChannel} from "discord.js";

export default {
    name: "threadDelete",
    async execute(client: EagleClient, thread: ThreadChannel) {
        if (!thread.guildId)return;
        const channel = client.func.log.isActive(thread.guildId, "ThreadDelete");
        if (!channel)return;
        const audit = await thread.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ThreadDelete,
        })

        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Nom:** ${thread.name}\n\n`+
                        `**ID:** ${thread.id}\n\n`+
                        `**Type:** ${thread.type == ChannelType.GuildPublicThread ? "Thread Publique" : thread.type == ChannelType.GuildPrivateThread ? "Thread Privé" : "Thread D'annonce"}`+
                        `**Supprimé par:** <@${audit.entries.first().executor.id}>\n\n`+
                        `[Cliquer ici pour voir le thread](${thread.url})`
                    )
            ],
        });
    }
}