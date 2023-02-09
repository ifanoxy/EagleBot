const { AuditLogEvent, GuildMember, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} Parametre
     */
    async execute(client, Parametre) {
        const blacklistsData = client.managers.blacklists.getIfExist(Parametre.user.id);
        if (blacklistsData) {
            Parametre.ban({
                reason: "Blacklist",
            })
        }
    }
};