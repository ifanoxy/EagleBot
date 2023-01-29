const { AuditLogEvent, EmbedBuilder, Role } = require("discord.js")
const path = require("path");

module.exports = {
    name: "roleDelete",
    /**
     * 
     * @param {*} client 
     * @param {Role} Parametre 
     */
    async execute(client, Parametre) {
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.RoleDelete) return;
        const channel = guildData.logs.channel.RoleDelete;
        if (channel == null || channel == undefined) return;

        const audit = (await Parametre.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleDelete,
        })).entries.first()
        
        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Nom:** <@#${Parametre.name}>\n\n`+
                    `**Id:** <@#${Parametre.id}>\n\n`+
                    `**Supprimé par:** <@${audit.executor.id}>`
                )
            ]
        });
    }
}