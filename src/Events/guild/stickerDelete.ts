import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, Sticker} from "discord.js";

export default {
    name: "stickerDelete",
    async execute(client: EagleClient, sticker: Sticker) {
        const channel = client.func.log.isActive(sticker.guildId, "StickerDelete");
        if (!channel)return;

        const audit = await sticker.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.StickerDelete,
        })

        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Nom:** ${sticker.name}\n\n`+
                        `**ID:** ${sticker.id}\n\n`+
                        `**Description:** ${sticker.description || 'aucune'}\n\n`+
                        `**Supprimé par:** <@${audit.entries.first().executor.id}>`
                    )
                    .setImage(sticker.url)
            ],
        });
    }
}