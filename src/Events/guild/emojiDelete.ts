import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildEmoji} from "discord.js";

export default {
    name: "emojiDelete",
    execute(client: EagleClient, emoji: GuildEmoji) {
        const channel = client.func.log.isActive(emoji.guild.id, "EmojiDelete");
        if (!channel)return;
        emoji.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.EmojiDelete,
        }).then(audit => {
            channel.send({
                embeds: [
                    new EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(
                            `**Nom:** ${emoji.name}\n\n`+
                            `**Animé:** ${emoji.animated ? "Oui" : "Non"}\n\n`+
                            `**Supprimé par:** <@${audit.entries.first().executor.id}>`
                        )
                ]
            });
        })
    }
}