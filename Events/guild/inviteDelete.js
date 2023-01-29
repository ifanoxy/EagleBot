const { AuditLogEvent, EmbedBuilder, Invite } = require("discord.js")
const path = require("path");

module.exports = {
    name: "inviteDelete",
    /**
     * 
     * @param {*} client 
     * @param {Invite} Parametre 
     */
    async execute(client, Parametre) {
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.InviteDelete) return;
        const channel = guildData.logs.channel.InviteDelete;
        if (channel == null || channel == undefined) return;

        const audit = await Parametre.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.InviteDelete,
        })

        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Code:** ${Parametre.code}\n\n`+
                    `**Supprimée par:** <@${audit.entries.first().executor.id}>`
                )
            ]
        });
    }
}