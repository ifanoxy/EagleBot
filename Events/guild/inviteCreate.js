const { AuditLogEvent, EmbedBuilder, Invite } = require("discord.js")
const path = require("path");

module.exports = {
    name: "inviteCreate",
    /**
     * 
     * @param {*} client 
     * @param {Invite} Parametre 
     */
    async execute(client, Parametre) {
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.InviteCreate) return;
        const channel = guildData.logs.channel.InviteCreate;
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
                    `**Expire** <t:${Math.round(Parametre.expiresTimestamp/1000)}:R>\n\n`+
                    `**Nombre d'utilisations maximum:** ${Parametre.maxUses}\n\n`+
                    `**Créée par:** <@${Parametre.inviterId}>`
                )
            ]
        });
    }
}