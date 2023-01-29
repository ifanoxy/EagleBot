const { AuditLogEvent, EmbedBuilder, Message, messageLink } = require("discord.js")
const path = require("path");

module.exports = {
    name: "messageDelete",
    /**
     * 
     * @param {*} client 
     * @param {Message} Parametre 
     */
    async execute(client, Parametre) {
        if (Parametre.member?.bot)return;
        if (!Parametre.guildId)return;
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.MessageDelete) return;
        const channel = guildData.logs.channel.MessageDelete;
        if (channel == null || channel == undefined) return;

        client.channels.cache.get(channel).send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Message de:** <@${Parametre.author?.id || Parametre.member?.id}>\n\n`+
                    `**Envoyé :** <t:${Math.round(Parametre.createdTimestamp/1000)}:R>\n\n`+
                    `**Contenu du message :**\n\`\`\`${Parametre.content || "'Ne contient rien'"}\`\`\``+
                    `**Fichier :** ${Parametre.attachments.map(x => x.proxyURL).join("\n") || "Aucun"}`
                )
            ]
        });
    }
}