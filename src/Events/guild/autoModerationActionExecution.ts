import {EagleClient} from "../../structures/Client";
import {AutoModerationActionExecution, EmbedBuilder} from "discord.js";

export default {
    name: "autoModerationActionExecution",
    execute(client: EagleClient, autoModerationActionExecution: AutoModerationActionExecution) {
        const channel = client.func.log.isActive(autoModerationActionExecution.guild.id, "autoModerationActionExecution");
        if (!channel)return;
        let action: any = autoModerationActionExecution.action.type
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
        let type: any = autoModerationActionExecution.ruleTriggerType
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
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Type:** ${type}\n\n`+
                        `**Action:** ${action}\n\n`+
                        `**Channel:** <#${autoModerationActionExecution.channelId}>\n\n`+
                        `**Utilisateur:** <@${autoModerationActionExecution.userId}>`+
                        `**Contenu:** \`${autoModerationActionExecution.content}\`\n\n`
                    )
            ]
        });
    }
}