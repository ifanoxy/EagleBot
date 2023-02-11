const { Guild, Member } = require("eris");
const { AntiRaidClient } = require("../../structures/AntiRaidClient");

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Guild} guild 
     * @param {Member} member 
     * @param {Number} emitTimestamp 
     */
    async execute(client, guild, member, emitTimestamp) {
        const database = client.antiraid.getIfExist(guild.id);
        if (!database)return;
        if (!member?.bot)return;
        const protectData = database.status["anti-bot"];
        if (!protectData.status)return;
        const AuditLog = await guild.getAuditLog({limit: 1});
        if (AuditLog.entries[0].actionType != 28)return;
        if (client.isOwner(userId))return;
        if (protectData.ignoreWhitelist) {
            if(client.checkWhitelist(AuditLog.entries[0].user.id))return;
        };
        const executor = await guild.fetchMembers({userIDs: AuditLog.entries[0].user.id, limit: 1});
        client.applySanction(executor[0], protectData.sanction, database.log, client.ping(guild)+Math.round(new Date().getTime()/1000)-emitTimestamp, "Bot Add");
        guild.kickMember(member.id, "Anti Raid").catch(() => {});
    }
}