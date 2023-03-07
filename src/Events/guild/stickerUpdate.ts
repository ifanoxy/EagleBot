import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, Role} from "discord.js";
import {DatabaseManager} from "../../structures/Managers/main";
import {Antiraid} from "../../structures/Interfaces/Managers";

export default {
    name: "stickerUpdate",
    execute(client: EagleClient, oldRole: Role | null, newRole: Role) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(newRole.guild.id)
        if (AntiraidData?.status["anti-massSticker"]?.update?.status) this.antiraid(AntiraidData, newRole, client);
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: Role, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.StickerUpdate});
        const userId = AuditLog.entries.first().executor.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massSticker"].update.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massSticker"].update.frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.stickerUpdate || 0) < maxfrequence-1) {
            frequenceData.stickerUpdate = (frequenceData?.stickerUpdate || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.stickerUpdate -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massSticker"].update.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massSticker"].update.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member[0], AntiraidData.status["anti-massSticker"].update.sanction, AntiraidData, "Mass Role Update");
        delete frequenceData?.stickerUpdate;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}