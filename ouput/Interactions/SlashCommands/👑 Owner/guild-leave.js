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
        .setName("guild-leave")
        .setDescription("permet de faire quitter le bot d'un serveur.")
        .setDMPermission(false)
        .addStringOption(opt => opt.setName("guild").setDescription("Veuillez choisir le serveur que vous voulez quitter").setRequired(true).setAutocomplete(true)),
    autocomplete(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const focusedValue = interaction.options.getFocused();
            const choices = client.guilds.cache.map(x => ({ name: x.name, id: x.id }));
            const filtered = choices.filter(choice => choice.name.includes(focusedValue) || choice.id.includes(focusedValue)).slice(0, 25);
            yield interaction.respond(filtered.map(choice => ({ name: `${choice.name} - ${choice.id}`, value: choice.id })));
        });
    },
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = interaction.options.getString("guild");
            const guild = yield client.guilds.fetch(id);
            guild.leave()
                .then(() => {
                interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Yellow")
                            .setDescription("Vous venez de quitter le serveur avec succès !")
                    ]
                }).catch();
            })
                .catch((err) => {
                if (err.name == "Error [GuildOwned]") {
                    guild.delete()
                        .then(() => {
                        interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor("Yellow")
                                    .setDescription("Vous venez de quitter le serveur avec succès !")
                            ]
                        });
                    }).catch();
                }
            });
        });
    }
};
