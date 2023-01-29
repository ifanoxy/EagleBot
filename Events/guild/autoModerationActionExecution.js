const { EmbedBuilder } = require("discord.js");
const path = require("path")
module.exports = {
    name: "autoModerationActionExecution",
    /**
     * 
     * @param {*} client 
     * @param {import("discord.js").AutoModerationActionExecution} Parametre 
     */
    execute(client, Parametre) {
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.autoModerationActionExecution) return;
        const channel = client.channels.cache.get(guildData.logs.channel.autoModerationActionExecution);
        if (channel == null || channel == undefined) return;
        let action = Parametre.action.type
        switch (action) {
            case 1 : {
                action = "Message bloqué"
            }break;
            case 2 : {
                action = "Envoie d'un message d'alert"
            }break;
            case 3 : {
                action = "Timeout l'utilisateur"
            }break;
        }
        let type = Parametre.ruleTriggerType
        switch (type) {
            case 1 : {
                type = "Mots clés"
            }break;
            case 4 : {
                type = "Mots clés prédéfinis"
            }break;
            case 5 : {
                type = "Spam de mention"
            }break;
            case 3 : {
                type = "Spam"
            }break;
        }
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                .setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`)
                .setDescription(
                    `**Type:** ${type}\n\n`+
                    `**Action:** ${action}\n\n`+
                    `**Channel:** <#${Parametre.channelId}>\n\n`+
                    `**Utilisateur:** <@${Parametre.userId}>`+
                    `**Contenu:** \`${Parametre.content}\`\n\n`
                )
            ]
        });
    }
}