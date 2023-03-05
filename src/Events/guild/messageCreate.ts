import {EagleClient} from "../../structures/Client";
import {EmbedBuilder, Message} from "discord.js";

export default {
    name: "messageCreate",
    execute(client: EagleClient, message: Message) {
        if (!message.guildId)return;
        if (message.author.bot)return;
        const guildData = client.managers.guildsManager.getIfExist(message.guild.id);
        if (!guildData) return;
        if (guildData.autoreply.length > 0) {
            if (message.content.split(" ").length <= 3)return;
            for (let autoreply of guildData.autoreply) {
                const mots = message.content.split(" ")
                let compteur = 0
                for (let i = 0; i < mots.length; i++) {
                    if (i < 2) {
                        if (autoreply.question.split(" ").map(w => w.toLowerCase()).slice(i, i+2).includes(mots[i].toLowerCase())) compteur ++;
                    } else {
                        if (autoreply.question.split(" ").map(w => w.toLowerCase()).slice(i-2, i+2).includes(mots[i].toLowerCase())) compteur ++;
                    }

                }
                if (compteur/autoreply.question.split(" ").length*100 > 50) {
                    message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({name: "Réponse automatique", iconURL: message.author.avatarURL()})
                                .setColor("White")
                                .setDescription(`
                                **Question interprétée:** ${autoreply.question}
                                **Réponse :** ${autoreply.reponse}
                            `)
                                .setFooter({text: `Pourcentage de ressemblance : ${Math.round(compteur/autoreply.question.split(" ").length*10000)/100}%`})
                        ]
                    });
                    break;
                }
            }
        }
    }
}