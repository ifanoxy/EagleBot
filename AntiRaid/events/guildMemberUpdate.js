const { Guild, Member } = require("eris");
const { AntiRaidClient } = require("../../structures/AntiRaidClient");

module.exports = {
    name: "guildMemberUpdate",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {Guild} guild
     * @param {Member} member
     * @param {Member} oldMember
     * @param {Number} emitTimestamp 
     */
    async execute(client, guild, member, oldMember, emitTimestamp) {
        const database = client.antiraid.getIfExist(guild.id);
        if (!database)return;
        const protectData = database.status["anti-roleAdmin"];
        if (!protectData.status)return;
        const AuditLog = await guild.getAuditLog({limit: 1});
        const userId = AuditLog.entries[0].user.id;
        if (client.isOwner(userId))return;
        if (protectData.ignoreWhitelist) {
            if(client.isWhitelist(userId))return;
        };
        if (AuditLog.entries[0].actionType != 25)return;
        const memberRoleAdmin = member?.roles.filter(x => !oldMember?.roles.includes(x)).filter(x => guild.roles.get(x).permissions.has("administrator"));
        if (memberRoleAdmin.length > 0 && member?.roles.length > oldMember?.roles.length) {
            guild.removeMemberRole(member.id, memberRoleAdmin[0], "Anti Raid")
            const executor = await guild.fetchMembers({userIDs: userId, limit: 1});
            client.applySanction(executor[0], protectData.sanction, database.log, client.ping(guild)+Math.round(new Date().getTime()/1000)-emitTimestamp, "Role Admin Add");
        }
    }
}