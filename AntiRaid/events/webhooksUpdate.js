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
        switch (AuditLog.entries[0].actionType) {
            case 50 : {
                console.log("webhook créer", AuditLog, guild.shard.latency +  Math.round(new Date().getTime()/1000) - emitTimestamp)
            }break;
            case 51 : {
                console.log("webhook modifé", AuditLog, guild.shard.latency +  Math.round(new Date().getTime()/1000) - emitTimestamp)
            }break;
            case 52 : {
                console.log("webhook supprimer", AuditLog, guild.shard.latency + Math.round(new Date().getTime()/1000) - emitTimestamp)
            }break;
        }
    }
}