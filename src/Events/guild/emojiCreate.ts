import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildEmoji} from "discord.js";

export default {
    name: "emojiCreate",
    execute(client: EagleClient, emoji: GuildEmoji) {
        const channel = client.func.log.isActive(emoji.guild.id, "EmojiCreate");
        if (!channel)return;
        emoji.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.EmojiCreate,
        }).then(audit => {
            channel.send({
                embeds: [
                    new EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(
                            `**Nom:** ${emoji.name}\n\n`+
                            `**ID:** ${emoji.id}\n\n`+
                            `**Animé:** ${emoji.animated ? "Oui" : "Non"}\n\n`+
                            `**Emoji:** <:${emoji.name}:${emoji.id}>\n\n`+
                            `**Créé par:** <@${audit.entries.first().executor.id}>`
                        )
                ]
            });
        })
    }
}