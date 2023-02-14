const { Guild, User } = require("eris");
const { AntiRaidClient } = require("../../structures/AntiRaidClient");

module.exports = {
    name: "guildBanAdd",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Guild} guild 
     * @param {User} user 
     * @param {Number} emitTimestamp 
     */
    async execute(client, guild, user, emitTimestamp) {
        const database = client.antiraid.getIfExist(guild?.id);
        if (!database)return;
        const protectData = database.status["anti-massBan"];
        if (!protectData.status)return;
        const AuditLog = await guild.getAuditLog({limit: 1});
        const userId = AuditLog.entries[0].user.id;
        if (client.isOwner(userId))return;
        if (protectData.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        };
        if (AuditLog.entries[0].actionType != 22)return;

        const maxfrequence = protectData.frequence.split('/')[0];
        try {
            var frequenceData = require(`../frequence/${userId}.json`);
        } catch {
            var frequenceData = {};
        }
        if ((frequenceData?.banAdd || 0) < maxfrequence-1) {
            frequenceData.banAdd = (frequenceData?.banAdd || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.banAdd -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(protectData.frequence.split('/')[1].slice(0, protectData.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await guild.fetchMembers({limit: 1, userIDs: [userId]});
        client.applySanction(member[0], protectData.sanction, database.log, client.ping(guild)+Math.round(new Date().getTime()/1000)-emitTimestamp, "Mass Ban");
        delete frequenceData?.banAdd;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}