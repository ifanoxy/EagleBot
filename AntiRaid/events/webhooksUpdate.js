const { AntiRaidClient } = require("../../structures/AntiRaidClient")

module.exports = {
    name: "webhooksUpdate",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {import("eris").WebhookData} data
     */
    async execute(client, data, emitTimestamp) {
        const database = client.antiraid.getIfExist(data.guildID);
        if (!database)return;
        const guild = client.guilds.get(data.guildID)
        const AuditLog = await guild.getAuditLog({limit: 1});
        if (![50, 51, 52].includes(AuditLog.entries[0].actionType))return;
        const protectData = database.status["anti-webhook"];
        if (!protectData.status)return;
        if (protectData.ignoreWhitelist) {
            if(client.checkWhitelist(AuditLog.entries[0].user.id))return;
        };
        const member = await guild.fetchMembers({limit: 1, userIDs: [AuditLog.entries[0].user.id]});
        client.applySanction(member[0], protectData.sanction, database.log, client.ping(guild)+Math.round(new Date().getTime()/1000)-emitTimestamp);
    }
}