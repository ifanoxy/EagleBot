import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildBan, GuildChannel} from "discord.js";
import {DatabaseManager} from "../../structures/Managers/main";
import {Antiraid} from "../../structures/Interfaces/Managers";

export default {
    name: "guildBanAdd",
    execute(client: EagleClient, member: GuildBan) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(member.guild.id)
        if (AntiraidData?.status["anti-massBan"]?.status) this.antiraid(AntiraidData, member, client);
        const channel = client.func.log.isActive(member.guild.id, "MemberBanAdd");
        if (!channel)return;
        member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd,
        }).then(audit => {
            channel.send({
                embeds: [
                    new EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(
                            `**Membre:** <@${member.user.id}>\n\n` +
                            `**Raison** ${member.reason || "Pas de raison"}\n\n` +
                            `**Banni par:** <@${audit.entries.first().executor.id}>`
                        )
                ]
            });
        });
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: GuildChannel, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.MemberBanAdd});
        const userId = AuditLog.entries.first().executor.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massBan"].ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massBan"].frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.banAdd || 0) < maxfrequence-1) {
            frequenceData.banAdd = (frequenceData?.banAdd || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.banAdd -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massBan"].frequence.split('/')[1].slice(0, AntiraidData.status["anti-massBan"].frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member, AntiraidData.status["anti-massBan"].sanction, AntiraidData.log, "Mass Ban");
        delete frequenceData?.banAdd;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}