const { Sticker } = require("discord.js");
const { AntiRaidClient } = require("../../structures/AntiRaidClient");

module.exports = {
    name: "guildStickersUpdate",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Sticker} sticker
     * @param {Number} emitTimestamp 
     */
    async execute(client, sticker, oldSticket, emitTimestamp) {
        const database = client.antiraid.getIfExist(sticker.guildId);
        if (!database)return;
        const guild = client.guilds.get(sticker.guild.id)
        const AuditLog = await guild.getAuditLog({limit: 1});
        if (![90, 91, 92].includes(AuditLog.entries[0].actionType))return;
        const protectData = database.status["anti-massSticker"][AuditLog.entries[0].actionType == 90 ? "create" : AuditLog.entries[0].actionType == 91 ? "update" : "delete"];
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
        if ((frequenceData[`sticker${AuditLog.entries[0].actionType}`] || 0) < maxfrequence-1) {
            frequenceData[`sticker${AuditLog.entries[0].actionType}`] = (frequenceData[`sticker${AuditLog.entries[0].actionType}`] || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData[`sticker${AuditLog.entries[0].actionType}`] -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(protectData.frequence.split('/')[1].slice(0, protectData.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await guild.fetchMembers({limit: 1, userIDs: [userId]});
        client.applySanction(member[0], protectData.sanction, database.log, client.ping(guild)+Math.round(new Date().getTime()/1000)-emitTimestamp, `Mass Sticker ${AuditLog.entries[0].actionType == 90 ? "Create" : AuditLog.entries[0].actionType == 91 ? "Update" : "Delete"}`);
        delete frequenceData[`sticker${AuditLog.entries[0].actionType}`];
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}