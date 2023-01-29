const { AuditLogEvent, EmbedBuilder, ThreadChannel } = require("discord.js")
const path = require("path");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    name: "webhookUpdate",
    /**
     * 
     * @param {EagleClient} client 
     * @param {ThreadChannel} Parametre 
     */
    async execute(client, Parametre) {
        if (!Parametre.guild) return;
        
        const audit = (await Parametre.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.WebhookDelete,
        })).entries.first();
        if (Math.round(audit.createdTimestamp/10000) != Math.round(new Date().getTime()/10000))return;

        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.WebhookDelete) return;
        const channel = guildData.logs.channel.WebhookDelete;
        if (channel == null || channel == undefined) return;


        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Nom:** ${audit.target.name}\n\n`+
                    `**ID:** ${audit.target.id}\n\n`+
                    `**Supprimé par:** <@${audit.executor.id}>\n\n`
                )
            ],
        });
    }
}