import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildChannel, GuildEmoji} from "discord.js";
import {DatabaseManager} from "../../structures/Managers/main";
import {Antiraid} from "../../structures/Interfaces/Managers";

export default {
    name: "emojiCreate",
    execute(client: EagleClient, emoji: GuildEmoji) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(emoji.guild.id)
        if (AntiraidData?.status["anti-massEmoji"]?.create?.status) this.antiraid(AntiraidData, emoji, client);
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: GuildChannel, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.EmojiCreate});
        const userId = AuditLog.entries.first().executor.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massEmoji"].create.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massEmoji"].create.frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.emojiCreate || 0) < maxfrequence-1) {
            frequenceData.emojiCreate = (frequenceData?.emojiCreate || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.emojiCreate -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massEmoji"].create.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massEmoji"].create.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member, AntiraidData.status["anti-massEmoji"].create.sanction, AntiraidData.log, "Mass Emoji Create");
        delete frequenceData?.emojiCreate;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}