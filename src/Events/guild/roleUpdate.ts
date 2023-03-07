import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, Role} from "discord.js";
import {DatabaseManager} from "../../structures/Managers/main";
import {Antiraid} from "../../structures/Interfaces/Managers";

export default {
    name: "roleUpdate",
    execute(client: EagleClient, oldRole: Role | null, newRole: Role) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(newRole.guild.id)
        if (AntiraidData?.status["anti-massRole"]?.create?.status) this.antiraid(AntiraidData, newRole, client);
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: Role, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.RoleUpdate});
        const userId = AuditLog.entries.first().executor.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massRole"].update.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massRole"].update.frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.roleUpdate || 0) < maxfrequence-1) {
            frequenceData.roleUpdate = (frequenceData?.roleUpdate || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.roleUpdate -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massRole"].update.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massRole"].update.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member, AntiraidData.status["anti-massRole"].update.sanction, AntiraidData.log, "Mass Role Update");
        delete frequenceData?.roleUpdate;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}