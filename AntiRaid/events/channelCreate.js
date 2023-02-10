const { AntiRaidClient } = require("../../structures/AntiRaidClient");

module.exports = {
    name: "channelCreate",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {import("eris").AnyChannel} channel 
     * @param {Number} emitTimestamp 
     */
    async execute(client, channel, emitTimestamp) {
        const database = client.antiraid.getIfExist(channel.guild.id);
        if (!database)return;
        const protectData = database.status["anti-massChannel"].create;
        if (!protectData.status)return;
        const guild = client.guilds.get(channel.guild.id)
        const AuditLog = await guild.getAuditLog({limit: 1});
        const userId = AuditLog.entries[0].user.id
        if (protectData.ignoreWhitelist) {
            if(client.checkWhitelist(userId))return;
        };
        if (AuditLog.entries[0].actionType != 10)return;

        const maxfrequence = protectData.frequence.split('/')[0];
        let frequenceData = require("../frequence.json");
        if ((frequenceData[userId]?.create || 1) < maxfrequence) {
            frequenceData[userId].create = (frequenceData[userId]?.create || 0) + 1;
            client._fs.writeFileSync("./AntiRaid/frequence.json", JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData[userId].create -= 1;
                    client._fs.writeFileSync("./AntiRaid/frequence.json", JSON.stringify(frequenceData));
                } catch {}
            }, (Number(protectData.frequence.split('/')[1].slice(0, protectData.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await guild.fetchMembers({limit: 1, userIDs: [userId]});
        client.applySanction(member[0], protectData.sanction, database.log, client.ping(guild)+Math.round(new Date().getTime()/1000)-emitTimestamp, "Mass Channel Create");
        delete frequenceData[userId]?.create;
        client._fs.writeFileSync("./AntiRaid/frequence.json", JSON.stringify(frequenceData));
    }
}