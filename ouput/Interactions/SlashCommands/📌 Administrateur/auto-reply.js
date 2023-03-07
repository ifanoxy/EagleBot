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
        .setName("autoreply")
        .setDescription("Vous permet de gérer les préponses automatiques aux messages")
        .setDMPermission(false)
        .addSubcommand(sub => sub
        .setName("create")
        .setDescription("Vous permet de créer une préponse automatique à un message")
        .addStringOption(option => option.setName("question").setDescription("Quelle est la question que vous souhaitez répondre").setRequired(true))
        .addStringOption(option => option.setName("réponse").setDescription("Définissez la réponse à la question").setRequired(true)))
        .addSubcommand(sub => sub
        .setName("delete")
        .setDescription("Vous permet de supprimer une question de l'auto reply")
        .addStringOption(option => option.setName("question").setDescription("la question que vous souhaitez supprimer").setRequired(true).setAutocomplete(true)))
        .addSubcommand(sub => sub
        .setName("list")
        .setDescription("Permet d'affichier la liste des questions avec leur réponse")),
    autocomplete(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            var guildData = client.managers.guildsManager.getIfExist(interaction.guildId);
            const focusedValue = interaction.options.getFocused();
            let choices = [];
            if (guildData.autoreply.length == 0) {
                choices.push("Vous n'avez pas créer d'auto reply --> /autoreply-create");
            }
            else {
                choices = guildData.autoreply.map(autorep => autorep.question);
            }
            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            yield interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
        });
    },
    execute(interaction, client) {
        var _a;
        var guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId,
        });
        switch (interaction.options.getSubcommand()) {
            case "create":
                {
                    const question = interaction.options.getString("question");
                    const reponse = interaction.options.getString("réponse");
                    guildData.autoreply.push({
                        question: question,
                        reponse: reponse,
                    });
                    guildData.save();
                    interaction.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setTitle("Vous venez d'ajouter un auto reply")
                                .setColor("#eb2384")
                                .addFields({
                                name: "Question",
                                value: `${question}`
                            }, {
                                name: "Réponse",
                                value: `${reponse}`,
                            })
                        ]
                    });
                }
                break;
            case "delete":
                {
                    const question = interaction.options.getString("question");
                    if (question == "Vous n'avez pas créer d'auto reply --> /autoreply-create")
                        return interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setTitle("Vous n'avez pas créer d'auto reply")
                                    .setColor("Blurple")
                                    .setDescription(`Utilisez la commande ${client.application.commands.cache.filter(i => i.name == "autoreply-create").map(a => `</${a.name}:${a.id}>`)} pour en créer`)
                            ]
                        });
                    guildData.autoreply = guildData.autoreply.filter(a => a.question != question);
                    guildData.save();
                    interaction.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setTitle("Suppression d'un auto reply")
                                .setColor("Red")
                                .setDescription(`Vous avez retiré avec succès de l'auto reply la question :\n\`${question}\``)
                        ]
                    });
                }
                break;
            case "list":
                {
                    if (guildData.autoreply.length == 0)
                        return interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setTitle("Vous n'avez créer aucun auto reply")
                                    .setColor("Red")
                                    .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "autoreply-create").map(a => `</${a.name}:${a.id}>`)} pour en créer`)
                            ]
                        });
                    interaction.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setTitle("Voici la liste de vos auto reply :")
                                .setColor("#eb2384")
                                .addFields(((_a = guildData.autoreply) === null || _a === void 0 ? void 0 : _a.map(autorep => {
                                return {
                                    name: autorep.question,
                                    value: autorep.reponse,
                                };
                            })) || [{ name: "Aucun autoreply", value: "/auto-reply create" }])
                        ]
                    });
                }
                break;
        }
    }
};
