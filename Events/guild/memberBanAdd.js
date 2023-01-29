const { GuildBan, AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildBanAdd",
    /**
     * @param {GuildBan} Parametre
     */
    async execute(client, Parametre) {
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.MemberBanAdd) return;
        const channel = guildData.logs.channel.MemberBanAdd;
        if (channel == null || channel == undefined) return;

        const audit = await Parametre.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberBanAdd,
        })

        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Membre:** <@${Parametre.user.id}>\n\n`+
                    `**Raison** ${Parametre.reason || "Pas de raison"}\n\n`+
                    `**Nombre d'utilisations maximum:** ${Parametre.maxUses}\n\n`+
                    `**Banni par:** <@${audit.entries.first().executor.id}>`
                )
            ]
        });
    }
};