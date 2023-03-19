import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, Role} from "discord.js";
import {DatabaseManager} from "../../structures/Managers/main";
import {Antiraid} from "../../structures/Interfaces/Managers";

export default {
    name: "roleDelete",
    async execute(client: EagleClient, role: Role) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(role.guild.id)
        if (AntiraidData?.status["anti-massRole"]?.delete?.status) this.antiraid(AntiraidData, role, client);
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: Role, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.RoleDelete});
        const userId = AuditLog.entries.first().executor.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massRole"].delete.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massRole"].delete.frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.roleDelete || 0) < maxfrequence-1) {
            frequenceData.roleDelete = (frequenceData?.roleDelete || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.roleDelete -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massRole"].delete.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massRole"].delete.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member, AntiraidData.status["anti-massRole"].delete.sanction, AntiraidData.log, "Mass Role Delete");
        delete frequenceData?.roleDelete;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}