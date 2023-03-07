import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildChannel, Role} from "discord.js";
import {DatabaseManager} from "../../structures/Managers/main";
import {Antiraid} from "../../structures/Interfaces/Managers";

export default {
    name: "roleCreate",
    async execute(client: EagleClient, role: Role) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(role.guild.id)
        if (AntiraidData?.status["anti-massRole"]?.create?.status) this.antiraid(AntiraidData, role, client);
        const channel = client.func.log.isActive(role.guild.id, "RoleCreate");
        if (!channel)return;
        const audit = (await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleCreate,
        })).entries.first()
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Role:** <@#${role.id}>\n\n`+
                        `**Couleur Hexa** ${role.hexColor}\n\n`+
                        `**Permissions bitField:** ${role.permissions.bitfield}\n\n`+
                        `**Créé par:** <@${audit.executor.id}>`
                    )
            ]
        });
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: Role, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.RoleCreate});
        const userId = AuditLog.entries.first().executor.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massRole"].create.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massRole"].create.frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.roleCreate || 0) < maxfrequence-1) {
            frequenceData.roleCreate = (frequenceData?.roleCreate || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.roleCreate -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massRole"].create.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massRole"].create.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member[0], AntiraidData.status["anti-massRole"].create.sanction, AntiraidData, "Mass Role Create");
        delete frequenceData?.roleCreate;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}