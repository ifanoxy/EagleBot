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
        .setName("lastname")
        .setDescription("Permet de voir les anciens pseudo enregistrer par le bot")
        .addStringOption(opt => opt.setName("id").setDescription("L'id de la personne que vous souhaitez rechercher").setRequired(true)),
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = interaction.options.getString("id");
            const database = client.managers.lastnameManager.getIfExist(id);
            if (!database || (database === null || database === void 0 ? void 0 : database.namelist.length) == 0)
                return interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle(`Liste des anciens pseudo de ${(yield client.users.fetch(id)).tag || id}`)
                            .setDescription(`**Cette utilisateur n'a aucun pseudo d'enregistré !**`)
                            .setColor("Random")
                            .setTimestamp()
                    ]
                });
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle(`Liste des anciens pseudo de ${(yield client.users.fetch(id)).tag}`)
                        .setDescription(database.namelist.map(x => `**pseudo:** \`${x[0]}\` --> **Modifié le** <t:${x[1]}>`).join("\n"))
                        .setColor("Random")
                        .setTimestamp()
                ]
            });
        });
    }
};
