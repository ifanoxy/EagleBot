const { Emoji } = require("discord.js");
const { AntiRaidClient } = require("../../structures/AntiRaidClient");

module.exports = {
    name: "guildEmojisUpdate",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Emoji}emoji
     * @param {Number} emitTimestamp 
     */
    async execute(client, guild, emoji, oldemoji, emitTimestamp) {
        const database = client.antiraid.getIfExist(guild.id);
        if (!database)return;
        const AuditLog = await guild.getAuditLog({limit: 1});
        if (![60, 61, 62].includes(AuditLog.entries[0].actionType))return;
        const protectData = database.status["anti-massEmoji"][AuditLog.entries[0].actionType == 60 ? "create" : AuditLog.entries[0].actionType == 61 ? "update" : "delete"];
        if (!protectData.status)return;
        const userId = AuditLog.entries[0].user.id;
        if (client.isOwner(userId))return;
        if (protectData.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        };

        const maxfrequence = protectData.frequence.split('/')[0];
        try {
            var frequenceData = require(`../frequence/${userId}.json`);
        } catch {
            var frequenceData = {};
        }
        if ((frequenceData[`emoji${AuditLog.entries[0].actionType}`] || 0) < maxfrequence-1) {
            frequenceData[`emoji${AuditLog.entries[0].actionType}`] = (frequenceData[`emoji${AuditLog.entries[0].actionType}`] || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData[`emoji${AuditLog.entries[0].actionType}`] -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(protectData.frequence.split('/')[1].slice(0, protectData.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await guild.fetchMembers({limit: 1, userIDs: [userId]});
        client.applySanction(member[0], protectData.sanction, database.log, client.ping(guild)+Math.round(new Date().getTime()/1000)-emitTimestamp, `Mass Emoji ${AuditLog.entries[0].actionType == 60 ? "Create" : AuditLog.entries[0].actionType == 61 ? "Update" : "Delete"}`);
        delete frequenceData[`emoji${AuditLog.entries[0].actionType}`];
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}