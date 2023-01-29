const { AuditLogEvent, EmbedBuilder, GuildEmoji, Sticker, ThreadChannel } = require("discord.js")
const path = require("path");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    name: "threadDelete",
    /**
     * 
     * @param {EagleClient} client 
     * @param {ThreadChannel} Parametre 
     */
    async execute(client, Parametre) {
        if (!Parametre.guild) return;
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.ThreadDelete) return;
        const channel = guildData.logs.channel.ThreadDelete;
        if (channel == null || channel == undefined) return;

        const audit = await Parametre.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ThreadDelete,
        })

        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Nom:** ${Parametre.name}\n\n`+
                    `**ID:** ${Parametre.id}\n\n`+
                    `**Supprimé par:** <@${audit.entries.first().executor.id}>`
                )
                .setImage(Parametre.url)
            ],
        });
    }
}