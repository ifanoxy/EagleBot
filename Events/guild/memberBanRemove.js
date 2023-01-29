const { GuildBan, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildBanRemove",
    /**
     * @param {GuildBan} Parametre
     */
    async execute(client, Parametre) {
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.MemberBanRemove) return;
        const channel = guildData.logs.channel.MemberBanRemove;
        if (channel == null || channel == undefined) return;

        const audit = await Parametre.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanRemove,
        })

        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Membre:** <@${Parametre.user.id}>\n\n`+
                    `**débanni par:** <@${audit.entries.first().executor.id}>`
                )
            ]
        });
    }
};