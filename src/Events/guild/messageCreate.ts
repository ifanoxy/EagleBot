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
            for (let autoreply of guildData.autoreply) {
                const mots = message.content.split(" ")
                let compteur = 0
                for (let i = 0; i < mots.length; i++) {
                    if (i < 2) {
                        if (autoreply.question.split(" ").slice(i, i+2).includes(mots[i])) compteur ++;
                    } else {
                        if (autoreply.question.split(" ").slice(i-2, i+2).includes(mots[i])) compteur ++;
                    }

                }
                if (compteur >= mots.length - Math.ceil(mots.length/5)*2) {
                    message.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setAuthor({name: "Réponse automatique", iconURL: message.author.avatarURL()})
                                .setColor("White")
                                .setDescription(`
                                **Question interprétée:** ${autoreply.question}
                                **Réponse :** ${autoreply.reponse}
                            `)
                                .setFooter({text: `Pourcentage de ressemblance : ${compteur/mots.length*100}%`})
                        ]
                    });
                    break;
                }
            }
        }
    }
}