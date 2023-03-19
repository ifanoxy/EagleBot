import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, Role, Sticker} from "discord.js";
import {DatabaseManager} from "../../structures/Managers/main";
import {Antiraid} from "../../structures/Interfaces/Managers";

export default {
    name: "stickerDelete",
    async execute(client: EagleClient, sticker: Sticker) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(sticker.guild.id)
        if (AntiraidData?.status["anti-massSticker"]?.delete?.status) this.antiraid(AntiraidData, sticker, client);
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: Role, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.StickerDelete});
        const userId = AuditLog.entries.first().executor.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massSticker"].delete.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massSticker"].delete.frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.stickerDeletee || 0) < maxfrequence-1) {
            frequenceData.stickerDeletee = (frequenceData?.stickerDeletee || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.stickerDeletee -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massSticker"].delete.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massSticker"].delete.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member, AntiraidData.status["anti-massSticker"].delete.sanction, AntiraidData.log, "Mass Sticker Delete");
        delete frequenceData?.stickerDeletee;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}