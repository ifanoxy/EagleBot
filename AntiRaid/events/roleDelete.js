const { AntiRaidClient } = require("../../structures/AntiRaidClient");

module.exports = {
    name: "roleDelete",
    /**
     * 
     * @param {AntiRaidClient} client 
     * @param {import("eris").AnyRole} role 
     * @param {Number} emitTimestamp 
     */
    async execute(client, role, emitTimestamp) {
        if (client.checkOwner(userId))return;
        const database = client.antiraid.getIfExist(role.guild.id);
        if (!database)return;
        const protectData = database.status["anti-massRole"].delete;
        if (!protectData.status)return;
        const guild = client.guilds.get(role.guild.id)
        const AuditLog = await guild.getAuditLog({limit: 1});
        const userId = AuditLog.entries[0].user.id
        if (protectData.ignoreWhitelist) {
            if(client.checkWhitelist(userId))return;
        };
        if (AuditLog.entries[0].actionType != 10)return;

        const maxfrequence = protectData.frequence.split('/')[0];
        try {
            var frequenceData = require(`../frequence/${userId}.json`);
        } catch {
            var frequenceData = {};
        }
        if ((frequenceData?.RoleDelete || 1) < maxfrequence) {
            frequenceData.RoleDelete = (frequenceData?.RoleDelete || 0) + 1;
            client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
            setTimeout(() => {
                try {
                    frequenceData.RoleDelete -= 1;
                    client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
                } catch {}
            }, (Number(protectData.frequence.split('/')[1].slice(0, protectData.frequence.split('/')[1].length - 1)) * 1000))
            return;
        }

        const member = await guild.fetchMembers({limit: 1, userIDs: [userId]});
        client.applySanction(member[0], protectData.sanction, database.log, client.ping(guild)+Math.round(new Date().getTime()/1000)-emitTimestamp, "Mass Role Delete");
        delete frequenceData.RoleDelete;
        client._fs.writeFileSync(`./AntiRaid/frequence/${userId}.json`, JSON.stringify(frequenceData));
    }
}