const { AuditLogEvent, EmbedBuilder, GuildChannel } = require("discord.js")
const path = require("path");

module.exports = {
    name: "channelCreate",
    /**
     * 
     * @param {*} client 
     * @param {GuildChannel} Parametre 
     */
    async execute(client, Parametre) {
        if (!Parametre.guild) return;
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.ChannelCreate) return;
        const channel = guildData.logs.channel.ChannelCreate;
        if (channel == null || channel == undefined) return;

        let type;
        switch (Parametre.type) {
            case 5: {
                type = "Channel d'annonce"
            }break;
            case 4: {
                type = "Categorie"
            }break;
            case 15: {
                type = "Forum"
            }break;
            case 13: {
                type = "Channel de réunion"
            }break;
            case 0: {
                type = "Channel Textuel"
            }break;
            case 2: {
                type = "Channel vocal"
            }break;
        }
        const audit = await Parametre.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate,
        })

        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Nom:** ${Parametre.name}\n\n`+
                    `**Type:** ${type}\n\n`+
                    `**Channel:** <#${Parametre.id}> (${Parametre.id})\n\n`+
                    `**Catégorie:** <#${Parametre.parentId || "Aucune"}>\n\n`+
                    `**Créé par:** <@${audit.entries.first().executor.id}>`
                )
            ]
        });
    }
}