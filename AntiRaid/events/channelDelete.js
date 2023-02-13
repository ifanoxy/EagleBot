const { AntiRaidClient } = require("../../structures/AntiRaidClient");

module.exports = {
    name: "channelDelete",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {import("eris").AnyChannel} channel 
     * @param {Number} emitTimestamp 
     */
    async execute(client, channel, emitTimestamp) {
        const database = client.antiraid.getIfExist(channel.guild?.id);
        if (!database)return;
        const protectData = database.status["anti-massChannel"].delete;
        if (!protectData.status)return;
        const guild = client.guilds.get(channel.guild.id)
        const AuditLog = await guild.getAuditLog({limit: 1});
        const userId = AuditLog.entries[0].user.id;
        if (client.checkOwner(userId))return;
        if (client.isOwner(userId))return;
        if (protectData.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        };
        if (AuditLog.entries[0].actionType != 10)return;

        const maxfrequence = protectData.frequence.split('/')[0];
        try {
            var frequenceData = require(`../frequence/${userId}.json`);
        } catch {
            var frequenceData = {};
        }
        if ((frequenceData?.ChannelDelete || 1) < maxfrequence-1) {
            frequenceData.ChannelDelete = (frequenceData?.ChannelDelete || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.ChannelDelete -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(protectData.frequence.split('/')[1].slice(0, protectData.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await guild.fetchMembers({limit: 1, userIDs: [userId]});
        client.applySanction(member[0], protectData.sanction, database.log, client.ping(guild)+Math.round(new Date().getTime()/1000)-emitTimestamp, "Mass Channel Delete");
        delete frequenceData.ChannelDelete;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}