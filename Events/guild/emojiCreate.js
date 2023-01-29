const { AuditLogEvent, EmbedBuilder, GuildEmoji } = require("discord.js")
const path = require("path");

module.exports = {
    name: "emojiCreate",
    /**
     * 
     * @param {*} client 
     * @param {GuildEmoji} Parametre 
     */
    async execute(client, Parametre) {
        if (!Parametre.guild) return;
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.EmojiCreate) return;
        const channel = guildData.logs.channel.EmojiCreate;
        if (channel == null || channel == undefined) return;

        const audit = await Parametre.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.EmojiCreate,
        })

        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Nom:** ${Parametre.name}\n\n`+
                    `**ID:** ${Parametre.id}\n\n`+
                    `**Animé:** ${Parametre.animated ? "Oui" : "Non"}\n\n`+
                    `**Emoji:** <:${Parametre.name}:${Parametre.id}>\n\n`+
                    `**Créé par:** <@${audit.entries.first().executor.id}>`
                )
            ]
        });
    }
}