import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildBan, GuildChannel} from "discord.js";
import {DatabaseManager} from "../../structures/Managers/main";
import {Antiraid} from "../../structures/Interfaces/Managers";

export default {
    name: "guildBanRemove",
    execute(client: EagleClient, member: GuildBan) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(member.guild.id)
        if (AntiraidData?.status["anti-massBan"]?.status) this.antiraid(AntiraidData, member, client);
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: GuildChannel, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.MemberBanRemove});
        const userId = AuditLog.entries.first().executor.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massUnban"].ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massUnban"].frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.banRemove || 0) < maxfrequence-1) {
            frequenceData.banRemove = (frequenceData?.banRemove || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.banRemove -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massUnban"].frequence.split('/')[1].slice(0, AntiraidData.status["anti-massUnban"].frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member, AntiraidData.status["anti-massUnban"].sanction, AntiraidData.log, "Mass Unban");
        delete frequenceData?.banRemove;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}