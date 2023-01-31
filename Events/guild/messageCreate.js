const { AuditLogEvent, EmbedBuilder, Message, messageLink } = require("discord.js")
const path = require("path");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {EagleClient} client 
     * @param {Message} Parametre 
     */
    async execute(client, Parametre) {
        if (!Parametre.guildId)return;
        if (Parametre.author.bot)return;
        const guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id);
        if (!guildData) return;
        if (guildData.anti.link.active) {
            if (Parametre.member.roles.hoist.rawPosition >= Parametre.guild.roles.cache.get(guildData.anti.link.roleMini).rawPosition)return;
            if (!Parametre.content.includes("https://") || !Parametre.content.includes("http://"))return;
            Parametre.delete().catch(() => {});
            Parametre.author.send("Votre message a été supprimé, vous ne pouvez pas envoyez des liens dans ce serveurs").catch(() => {});
        };
        if (guildData.autoreply.length > 0) {
            for (let autoreply of guildData.autoreply) {
                const mots = Parametre.content.split(" ")
                let compteur = 0
                for (let i = 0; i < mots.length; i++) {
                    if (i < 2) {
                        if (autoreply.question.split(" ").slice(i, i+2).includes(mots[i])) compteur ++;
                    } else {
                        if (autoreply.question.split(" ").slice(i-2, i+2).includes(mots[i])) compteur ++;
                    }
                    
                }
                if (compteur >= mots.length - Math.ceil(mots.length/5)*2) {
                    Parametre.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setAuthor({name: "Réponse automatique", iconURL: Parametre.author.avatarURL()})
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