import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildChannel, GuildEmoji} from "discord.js";
import {DatabaseManager} from "../../structures/Managers/main";
import {Antiraid} from "../../structures/Interfaces/Managers";

export default {
    name: "emojiDelete",
    execute(client: EagleClient, emoji: GuildEmoji) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(emoji.guild.id)
        if (AntiraidData?.status["anti-massEmoji"]?.delete?.status) this.antiraid(AntiraidData, emoji, client);
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
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: GuildChannel, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.EmojiDelete});
        const userId = AuditLog.entries.first().executor.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massEmoji"].delete.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massEmoji"].delete.frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.emojiDelete || 0) < maxfrequence-1) {
            frequenceData.emojiDelete = (frequenceData?.emojiDelete || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.emojiDelete -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massEmoji"].delete.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massEmoji"].delete.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member, AntiraidData.status["anti-massEmoji"].delete.sanction, AntiraidData.log, "Mass Emoji Delete");
        delete frequenceData?.emojiDelete;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}