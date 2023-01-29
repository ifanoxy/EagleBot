const { GuildMember, AuditLogEvent, EmbedBuilder } = require("discord.js")
const path = require("path");

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {*} client 
     * @param {GuildMember} Parametre 
     */
    async execute(client, Parametre) {
        if (!Parametre.user.bot) return;
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.BotAdd) return;
        const channel = guildData.logs.channel.BotAdd;
        if (channel == null || channel == undefined) return;
        const audit = await Parametre.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.BotAdd,
        })

        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Bot ID:** <@${Parametre.id}> (${Parametre.id})\n\n`+
                    `**Ajouté par:** <@${audit.entries.first().executor.id}>`
                )
            ]
        });
    }
}