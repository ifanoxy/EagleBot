import {EagleClient} from "../../structures/Client";
import {EmbedBuilder, Message} from "discord.js";

export default {
    name: "messageDelete",
    execute(client: EagleClient, message: Message) {
        if (message.author.bot)return;
        const channel = client.func.log.isActive(message.guildId, "MessageDelete");
        if (!channel)return;
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | ${this.name}`)
                    .setDescription(
                        `**Message de:** <@${message.author?.id || message.member?.id}>\n\n`+
                        `**Envoyé :** <t:${Math.round(message.createdTimestamp/1000)}:R>\n\n`+
                        `**Contenu du message :**\n\`\`\`${message.content || "'Ne contient rien'"}\`\`\``+
                        message.attachments ? `**Fichier :** ${message.attachments.map(x => x.proxyURL).join("\n")}` : "Aucun"
                    )
            ]
        });
    }
}