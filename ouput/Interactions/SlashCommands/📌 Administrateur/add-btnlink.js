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
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("add-buttonlink")
        .setDescription("Ajout d'un bouton qui envoie vers un lien au message supérieur")
        .setDMPermission(false)
        .addStringOption(opt => opt.setName("url").setDescription("Le lien du bouton").setRequired(true)),
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (interaction.channel.type == discord_js_1.ChannelType.GuildStageVoice)
                    return;
                interaction.channel.messages.fetch({ limit: 1, cache: true })
                    .then(message => {
                    var _a;
                    if ((_a = message.first()) === null || _a === void 0 ? void 0 : _a.editable) {
                        message.first().edit({
                            components: [
                                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                    .setStyle(discord_js_1.ButtonStyle.Link)
                                    .setLabel(new URL(interaction.options.getString("url")).hostname)
                                    .setURL(interaction.options.getString("url")))
                            ]
                        }).catch(() => { });
                        interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setTitle("Boutton ajouté avec succès !")
                            ],
                            ephemeral: true,
                        });
                    }
                    else {
                        // @ts-ignore
                        interaction.channel.createWebhook({
                            name: message.first().author.username,
                            avatar: message.first().author.avatarURL() || client.user.avatarURL(),
                            reason: "Ajout d'un bouton avec un lien"
                        })
                            .then(webhook => {
                            webhook.send({
                                content: message.first().content,
                                embeds: message.first().embeds || [],
                                files: message.first().attachments.map(x => x) || [],
                                components: [
                                    new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                        .setStyle(discord_js_1.ButtonStyle.Link)
                                        .setLabel(new URL(interaction.options.getString("url")).hostname)
                                        .setURL(interaction.options.getString("url")))
                                ]
                            }).then(() => {
                                interaction.reply({
                                    embeds: [
                                        new discord_js_1.EmbedBuilder()
                                            .setTitle("Boutton ajouté avec succès !")
                                    ],
                                    ephemeral: true,
                                });
                                message.first().delete().catch(() => { });
                                webhook.delete().catch(() => { });
                            }).catch(() => {
                                webhook.delete().catch(() => { });
                            });
                        }).catch(() => { });
                    }
                });
            }
            catch (_a) { }
        });
    }
};
