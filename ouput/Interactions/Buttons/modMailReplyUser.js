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
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield client.users.fetch(interaction.customId.split("#")[1]);
            if (!user) {
                interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Red")
                            .setDescription("Cette utilisateur n'est plus dans un serveur ou je suis, je ne peux donc plus communiquer avec celui-ci.")
                    ]
                });
            }
            else {
                client.func.utils.askWithModal(interaction, new discord_js_1.ModalBuilder()
                    .setTitle(interaction.component.label)
                    .setCustomId("[no-check]modmailReplyUserModal")
                    .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                    .setLabel("Entrer la réponse que vous voulez envoyer")
                    .setStyle(discord_js_1.TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setCustomId("reponse")))).then(inter => {
                    if (!inter)
                        return;
                    const reponse = inter.fields.getTextInputValue("reponse");
                    user.send({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor(Embed_1.DiscordColor.Eagle)
                                .setTitle("ModMail")
                                .setDescription(`**Vous avez reçus une réponse de <@${inter.user.id}> :**\n\n${reponse}`)
                                .setTimestamp()
                        ]
                    });
                    inter.message.edit({
                        components: []
                    });
                    inter.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setTitle(`Réponse envoyé par ${inter.user.username}`)
                                .setDescription(reponse)
                                .setColor(Embed_1.DiscordColor.White)
                                .setTimestamp()
                        ]
                    });
                });
            }
        });
    }
};
