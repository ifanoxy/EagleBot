const { AutoModerationRule, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");
const path = require("path")

module.exports = {
    name: "autoModerationRuleCreate",
    /**
     * 
     * @param {EagleClient} client 
     * @param {AutoModerationRule} Parametre 
     */
    execute(client, Parametre) {
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.AutoModerationRuleUpdate) return;
        const channel = client.channels.cache.get(guildData.logs.channel.AutoModerationRuleUpdate);
        if (channel == null || channel == undefined) return;
        let action = [];
        for (let act of Parametre.actions) {
            switch (act) {
                case 1 : {
                    action.push("Message bloqué");
                }break;
                case 2 : {
                    action.push("Envoie d'un message d'alert")
                }break;
                case 3 : {
                    action.push("Timeout l'utilisateur")
                }break;
            }
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
                    `**Nom:** ${Parametre.name}\n\n`+
                    `**Type:** ${type}\n\n`+
                    `**Action:** ${action}\n\n`+
                    `**Activé:** ${Parametre.enabled ? "Oui" : "Non"}\n\n`+
                    `**Créé par:** <@${Parametre.creatorId}>\n\n`+
                    `**Channel exclus:** \`${Parametre.exemptChannels.size > 6 ? "Trop pour afficher" : Parametre.exemptChannels.map(c => `${c.name}`) || "Aucun"}\`\n\n`+
                    `**Role exclus:** \`${Parametre.exemptRoles.size > 6 ? "Trop pour afficher" : Parametre.exemptRoles.map(r => `${r.name}`) || "Aucun"}\`\n\n`
                )
            ]
        }); 
    }
}