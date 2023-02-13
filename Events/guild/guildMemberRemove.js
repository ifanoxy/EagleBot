const { AuditLogEvent, GuildMember, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * @param {GuildMember} Parametre
     */
    async execute(client, Parametre) {
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (guildData.logs.enable.MemberKick) {
            const channel = guildData.logs.channel.MemberKick;
            if (channel != null && channel != undefined) {
                const audit = await Parametre.guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberKick,
                })
                if(audit) {
                    client.channels.cache.get(channel).send({
                        embeds: [
                            new EmbedBuilder().setColor("#2f3136").setTimestamp()
                            .setTitle(`Logs | Member Kick `)
                            .setDescription(
                                `**Membre:** <@${Parametre.user.id}>\n\n`+
                                `**Raison** ${audit.entries.first().reason || "Pas de raison"}\n\n`+
                                `**Kick par:** <@${audit.entries.first().executor.id}>`
                            )
                        ]
                    });
                }
            }
        }
        
        if (guildData.join?.channelId) {
            client.fonctions.sendLeaveMessage(Parametre.guild.id, Parametre)
        }
    }
};