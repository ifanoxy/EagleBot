import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, ChannelType, EmbedBuilder, GuildChannel} from "discord.js";
import {Antiraid} from "../../structures/Interfaces/Managers";
import {DatabaseManager} from "../../structures/Managers/main";

export default {
    name: "channelCreate",
    execute(client: EagleClient, channel: GuildChannel) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(channel.guildId)
        if (AntiraidData?.status["anti-massChannel"]?.create?.status) this.antiraid(AntiraidData, channel, client);
        const channelSend = client.func.log.isActive(channel.guildId, "ChannelCreate");
        if (!channelSend)return;
        let type;
        switch (channel.type) {
            case ChannelType.GuildAnnouncement: {
                type = "Channel d'annonce"
            }break;
            case ChannelType.AnnouncementThread: {
                type = "Thread channel d'annonce"
            }break;
            case ChannelType.GuildCategory: {
                type = "Categorie"
            }break;
            case ChannelType.GuildForum: {
                type = "Forum"
            }break;
            case ChannelType.GuildStageVoice: {
                type = "Channel de réunion"
            }break;
            case ChannelType.GuildText: {
                type = "Channel Textuel"
            }break;
            case ChannelType.GuildVoice: {
                type = "Channel vocal"
            }break;
            case ChannelType.GuildNews: {
                type = "Thread Public"
            }break;
            case ChannelType.GuildPublicThread: {
                type = "Thread Public"
            }break;
            case ChannelType.GuildPrivateThread: {
                type = "Thread Privé"
            }break;
        }
        channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate,
        }).then(audit => {
            channelSend.send({
                embeds: [
                    new EmbedBuilder().setColor("#2f3136").setTimestamp()
                        .setTitle(`Logs | ${this.name}`)
                        .setDescription(
                            `**Nom:** ${channel.name}\n\n` +
                            `**Type:** ${type}\n\n` +
                            `**Channel:** <#${channel.id}> (${channel.id})\n\n` +
                            `**Catégorie:** <#${channel.parentId || "Aucune"}>\n\n` +
                            `**Créé par:** <@${audit.entries.first()?.executor.id}>`
                        )
                ]
            });
        });
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: GuildChannel, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.ChannelCreate});
        const userId = AuditLog.entries.first().executor.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massChannel"].create.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massChannel"].create.frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.channelCreate || 0) < maxfrequence-1) {
            frequenceData.channelCreate = (frequenceData?.channelCreate || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.channelCreate -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massChannel"].create.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massChannel"].create.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member[0], AntiraidData.status["anti-massChannel"].create.sanction, AntiraidData.log, "Mass Channel Create");
        delete frequenceData?.channelCreate;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}