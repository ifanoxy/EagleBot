import {EagleClient} from "../../structures/Client";
import {AuditLogEvent, EmbedBuilder, GuildChannel, GuildEmoji} from "discord.js";
import {DatabaseManager} from "../../structures/Managers/main";
import {Antiraid} from "../../structures/Interfaces/Managers";

export default {
    name: "emojiUpdate",
    execute(client: EagleClient, oldEmoji: GuildEmoji | null, newEmoji: GuildEmoji) {
        const AntiraidData = client.managers.antiraidManager.getIfExist(newEmoji.guild.id)
        if (!AntiraidData?.status["anti-massEmoji"]?.update?.status) this.antiraid(AntiraidData, newEmoji, client);
        const channel = client.func.log.isActive(newEmoji.guild.id, "EmojiUpdate");
        if (!channel)return;
        let changement: any = {};
        if (oldEmoji.name != newEmoji.name) changement.name = {
            old: oldEmoji.name,
            new: newEmoji.name,
        };
        if(Object.entries(changement).length == 0)return

        let logEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`Logs | ${this.name}`).setTimestamp().setDescription(`Channel ID : ${newEmoji.id} (<#${newEmoji.id}>)`)
        if (changement.name) logEmbed.addFields(
            {
                name: "Changement de nom",
                value: `Ancien: ${changement.name.old}\nNouveau: ${changement.name.new}`
            }
        );
        channel.send({
            embeds: [logEmbed]
        });
    },

    async antiraid(AntiraidData:  DatabaseManager<Antiraid> & Antiraid, channel: GuildChannel, client: EagleClient) {
        const AuditLog = await channel.guild.fetchAuditLogs({limit: 1, type: AuditLogEvent.EmojiUpdate});
        const userId = AuditLog.entries[0].user.id;
        if (client.isOwner(userId))return;
        if (AntiraidData.status["anti-massEmoji"].update.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        }
        const maxfrequence = Number(AntiraidData.status["anti-massEmoji"].update.frequence.split('/')[0]);
        try {
            var frequenceData: any = import(`../frequence/${userId}.json`);
        } catch {
            var frequenceData: any = {};
        }
        if ((frequenceData?.emojiUpdate || 0) < maxfrequence-1) {
            frequenceData.emojiUpdate = (frequenceData?.emojiUpdate || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.emojiUpdate -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(AntiraidData.status["anti-massEmoji"].update.frequence.split('/')[1].slice(0, AntiraidData.status["anti-massEmoji"].update.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await channel.guild.members.fetch(userId);
        await client.func.mod.applySanction(member[0], AntiraidData.status["anti-massEmoji"].update.sanction, AntiraidData, "Mass Channel Create");
        delete frequenceData?.emojiUpdate;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}