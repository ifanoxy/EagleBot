import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, ChannelType, EmbedBuilder, GuildChannel} from "discord.js";
import {DatabaseManager} from "../../structures/Managers/main";
import {Antiraid} from "../../structures/Interfaces/Managers";

export default {
    name: "channelUpdate",
    execute(client: EagleClient, oldChannel: GuildChannel | null, newChannel: GuildChannel) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(newChannel.guildId)
        if (AntiraidData?.status["anti-massChannel"]?.update?.status) this.antiraid(AntiraidData, newChannel, client);
        const channel = client.func.log.isActive(newChannel.guildId, "ChannelUpdate");
        if (!channel)return;
        let changement: {
            name?: {
                old: any,
                new: any
            },
            topic?: {
                old: any,
                new: any
            },
            parent?: {
                old: any,
                new: any
            },
        } = {};
        if (oldChannel?.name != newChannel.name) changement.name = {
            old: oldChannel.name,
            new: newChannel.name,
        };
        // @ts-ignore
        if (oldChannel?.topic != newChannel?.topic) changement.topic = {
            // @ts-ignore
            old: oldChannel?.topic,
            // @ts-ignore
            new: newChannel?.topic,
        };
        if (oldChannel?.parentId != newChannel?.parentId) changement.parent = {
            old: oldChannel?.parentId,
            new: newChannel?.parentId,
        };
        if(Object.entries(changement).length == 0)return

        let logEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`Logs | ${this.name}`).setTimestamp().setDescription(`Channel ID : ${newChannel.id} (<#${newChannel.id}>)`)
        if (changement.name) logEmbed.addFields(
            {
                name: "Changement de nom",
                value: `Ancien: ${changement.name.old}\nNouveau: ${changement.name.new}`
            }
        );
        if (changement.topic) logEmbed.addFields(
            {
                name: "Changement de topic",
                value: `Ancien: ${changement.topic.old}\nNouveau: ${changement.topic.new}`
            }
        );
        if (changement.parent) logEmbed.addFields(
            {
                name: "Changement de Catégorie",
                value: `Ancienne: ${changement.parent.old}\nNouvelle: ${changement.parent.new}`
            }
        );
        channel.send({
            embeds: [logEmbed]
        });
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: GuildChannel, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.ChannelUpdate});
        const userId = AuditLog.entries.first().executor.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massChannel"].update.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massChannel"].update.frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.channelUpdate || 0) < maxfrequence-1) {
            frequenceData.channelUpdate = (frequenceData?.channelUpdate || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.channelUpdate -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massChannel"].update.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massChannel"].update.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member[0], AntiraidData.status["anti-massChannel"].update.sanction, AntiraidData, "Mass Channel Update");
        delete frequenceData?.channelUpdate;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}