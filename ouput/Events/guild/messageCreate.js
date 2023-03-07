"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = require("../../structures/Enumerations/Embed");
exports.default = {
    name: "messageCreate",
    execute(client, message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (((_a = message === null || message === void 0 ? void 0 : message.author) === null || _a === void 0 ? void 0 : _a.id) == client.user.id)
                return;
            if (!message.guildId) {
                if (client.config.modmailChannelId) {
                    const channel = yield client.channels.fetch(client.config.modmailChannelId);
                    if (!channel) {
                        client.config.modmailChannelId = null;
                        client._fs.writeFileSync("./src/config.json", JSON.stringify(client.config, null, 2));
                        return;
                    }
                    ;
                    message.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setTitle("ModMail")
                                .setColor(Embed_1.DiscordColor.White)
                                .setDescription("Voulez-vous envoyer ce message aux modmail ?")
                        ],
                        components: [
                            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                .setCustomId("[no-check]modmail_send")
                                .setLabel("Envoyer")
                                .setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder()
                                .setCustomId("[no-check]modmail_cancel")
                                .setLabel("Ne pas Envoyer")
                                .setStyle(discord_js_1.ButtonStyle.Danger))
                        ],
                    }).then(msg => {
                        client.func.utils.askWithButton(msg, 60).then(inter => {
                            var _a;
                            if (!inter)
                                return;
                            if (inter.customId == "[no-check]modmail_send") {
                                if (channel.type == discord_js_1.ChannelType.GuildText) {
                                    channel.send({
                                        embeds: [
                                            new discord_js_1.EmbedBuilder()
                                                .setColor(Embed_1.DiscordColor.Eagle)
                                                .setTitle("Modmail")
                                                .setTimestamp()
                                                .setDescription(`**Message envoyé par <@${(_a = message.author) === null || _a === void 0 ? void 0 : _a.id}> :**\n\n${message.content.length < 4000 ? message.content : message.content.slice(0, 4000)}`)
                                        ],
                                        components: [
                                            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                                .setStyle(discord_js_1.ButtonStyle.Secondary)
                                                .setLabel(`Répondre à ${message.author.username}`)
                                                .setCustomId(`modMailReplyUser#${message.author.id}`))
                                        ],
                                        files: message.attachments.toJSON() || null
                                    });
                                    inter.update({
                                        embeds: [
                                            new discord_js_1.EmbedBuilder()
                                                .setTitle("ModMail")
                                                .setColor(Embed_1.DiscordColor.Green)
                                                .setDescription("Venez d'envoyer votre message au modmail avec succès !")
                                        ],
                                        components: []
                                    });
                                }
                            }
                            else {
                                inter.update({
                                    embeds: [
                                        new discord_js_1.EmbedBuilder()
                                            .setTitle("ModMail")
                                            .setColor(Embed_1.DiscordColor.Red)
                                            .setDescription("Venez n'avez pas envoyer votre message au modMail !")
                                    ],
                                    components: []
                                });
                            }
                        });
                    });
                }
                return;
            }
            ;
            if (message.author.bot)
                return;
            const guildData = client.managers.guildsManager.getIfExist(message.guild.id);
            if (!guildData)
                return;
            if (guildData.autoreply.length > 0) {
                if (message.content.split(" ").length <= 3)
                    return;
                for (let autoreply of guildData.autoreply) {
                    const mots = message.content.split(" ");
                    let compteur = 0;
                    for (let i = 0; i < mots.length; i++) {
                        if (i < 2) {
                            if (autoreply.question.split(" ").map(w => w.toLowerCase()).slice(i, i + 2).includes(mots[i].toLowerCase()))
                                compteur++;
                        }
                        else {
                            if (autoreply.question.split(" ").map(w => w.toLowerCase()).slice(i - 2, i + 2).includes(mots[i].toLowerCase()))
                                compteur++;
                        }
                    }
                    if (compteur / autoreply.question.split(" ").length * 100 > 50) {
                        message.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setAuthor({ name: "Réponse automatique", iconURL: message.author.avatarURL() })
                                    .setColor("White")
                                    .setDescription(`
                                **Question interprétée:** ${autoreply.question}
                                **Réponse :** ${autoreply.reponse}
                            `)
                                    .setFooter({ text: `Pourcentage de ressemblance : ${Math.round(compteur / autoreply.question.split(" ").length * 10000) / 100}%` })
                            ]
                        });
                        break;
                    }
                }
            }
        });
    }
};
