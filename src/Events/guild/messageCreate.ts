import {EagleClient} from "../../structures/Client";
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, Message} from "discord.js";
import {DiscordColor} from "../../structures/Enumerations/Embed";

export default {
    name: "messageCreate",
    async execute(client: EagleClient, message: Message) {
        if (message?.author?.id == client.user.id)return;
        if (!message.guildId) {
            if (client.config.modmailChannelId) {
                const channel = await client.channels.fetch(client.config.modmailChannelId);
                if (!channel) {
                    client.config.modmailChannelId = null
                    client._fs.writeFileSync("./src/config.json", JSON.stringify(client.config, null, 2));
                    return;
                };

                message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("ModMail")
                            .setColor(DiscordColor.White)
                            .setDescription("Voulez-vous envoyer ce message aux modmail ?")
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId("[no-check]modmail_send")
                                .setLabel("Envoyer")
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId("[no-check]modmail_cancel")
                                .setLabel("Ne pas Envoyer")
                                .setStyle(ButtonStyle.Danger),
                        )
                    ],
                }).then(msg => {
                    client.func.utils.askWithButton(msg, 60).then(inter => {
                        if (!inter)return
                        if (inter.customId == "[no-check]modmail_send") {
                            if (channel.type == ChannelType.GuildText) {
                                channel.send({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setColor(DiscordColor.Eagle)
                                            .setTitle("Modmail")
                                            .setTimestamp()
                                            .setDescription(`**Message envoyé par <@${message.author?.id}> :**\n\n${message.content.length < 4000 ? message.content : message.content.slice(0, 4000)}`)
                                    ],
                                    components: [
                                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                                            new ButtonBuilder()
                                                .setStyle(ButtonStyle.Secondary)
                                                .setLabel(`Répondre à ${message.author.username}`)
                                                .setCustomId(`modMailReplyUser#${message.author.id}`)
                                        )
                                    ],
                                    files: message.attachments.toJSON() || null
                                })
                                inter.update({
                                    embeds: [
                                        new EmbedBuilder()
                                            .setTitle("ModMail")
                                            .setColor(DiscordColor.Green)
                                            .setDescription("Venez d'envoyer votre message au modmail avec succès !")
                                    ],
                                    components: []
                                })
                            }
                        } else {
                            inter.update({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle("ModMail")
                                        .setColor(DiscordColor.Red)
                                        .setDescription("Venez n'avez pas envoyer votre message au modMail !")
                                ],
                                components: []
                            })
                        }
                    })
                })
            }
            return;
        };
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