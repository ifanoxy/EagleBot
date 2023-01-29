const { AuditLogEvent, EmbedBuilder, TextChannel } = require("discord.js")
const path = require("path");

module.exports = {
    name: "channelPinsUpdate",
    /**
     * 
     * @param {*} client 
     * @param {TextChannel} Parametre 
     * @param {Date} Parametre2
     */
    async execute(client, Parametre, Parametre2) {
        if (!Parametre.guildId)return;
        const audit = (await Parametre.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessagePin
        })).entries.first()
        if (Math.round(audit.createdTimestamp/10000) != Math.round(Parametre2/10000))return
        
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guildId);
        if (!guildData) return;
        if (!guildData.logs.enable.MessagePin) return;
        const channel = guildData.logs.channel.MessagePin;
        if (channel == null || channel == undefined) return;

        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Pin par :** <@${audit.executor.id}>\n\n`+
                    `**Contenu du message :**\n\`\`\`${Parametre.messages.cache.get(audit.extra.messageId).content}\`\`\``
                )
            ]
        });
    }
}