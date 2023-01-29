const { AuditLogEvent, EmbedBuilder, Role } = require("discord.js")
const path = require("path");

module.exports = {
    name: "roleCreate",
    /**
     * 
     * @param {*} client 
     * @param {Role} Parametre 
     */
    async execute(client, Parametre) {
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.RoleCreate) return;
        const channel = guildData.logs.channel.RoleCreate;
        if (channel == null || channel == undefined) return;

        const audit = (await Parametre.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleCreate,
        })).entries.first()
        
        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Role:** <@#${Parametre.id}>\n\n`+
                    `**Couleur Hexa** ${Parametre.hexColor}\n\n`+
                    `**Permissions bitField:** ${Parametre.permissions.bitfield}\n\n`+
                    `**Créé par:** <@${audit.executor.id}>`
                )
            ]
        });
    }
}