"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: "autoModerationActionExecution",
    execute(client, autoModerationActionExecution) {
        const channel = client.func.log.isActive(autoModerationActionExecution.guild.id, "autoModerationActionExecution");
        if (!channel)
            return;
        let action = autoModerationActionExecution.action.type;
        switch (action) {
            case 1:
                {
                    action = "Message bloqué";
                }
                break;
            case 2:
                {
                    action = "Envoie d'un message d'alert";
                }
                break;
            case 3:
                {
                    action = "Timeout l'utilisateur";
                }
                break;
        }
        let type = autoModerationActionExecution.ruleTriggerType;
        switch (type) {
            case 1:
                {
                    type = "Mots clés";
                }
                break;
            case 4:
                {
                    type = "Mots clés prédéfinis";
                }
                break;
            case 5:
                {
                    type = "Spam de mention";
                }
                break;
            case 3:
                {
                    type = "Spam";
                }
                break;
        }
        channel.send({
            embeds: [
                new discord_js_1.EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(`**Type:** ${type}\n\n` +
                    `**Action:** ${action}\n\n` +
                    `**Channel:** <#${autoModerationActionExecution.channelId}>\n\n` +
                    `**Utilisateur:** <@${autoModerationActionExecution.userId}>` +
                    `**Contenu:** \`${autoModerationActionExecution.content}\`\n\n`)
            ]
        });
    }
};
