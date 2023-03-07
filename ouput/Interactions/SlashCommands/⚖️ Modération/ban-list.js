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
        .setName("ban-list")
        .setDescription("Vous permet d'avoir la liste des utilisateurs bannis de votre serveur")
        .setDMPermission(false),
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const guildBans = yield interaction.guild.bans.fetch();
            if (guildBans.size == 0)
                return interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder().setDescription("Il y a personne de banni sur ce serveur !")
                    ]
                });
            let embedBans = new discord_js_1.EmbedBuilder().setTitle(`Liste des ${guildBans.size} membres bannis`).setColor("Gold");
            if (guildBans.size > 25) {
                let name = guildBans.map(x => `${x.user.id} | ${x.user.tag}`);
                let value = guildBans.map(x => `Raison: ${x.reason}`);
                client.func.utils.pagination(embedBans, name, value, interaction);
            }
            else {
                let i = 1;
                guildBans.map(ban => {
                    embedBans.addFields({
                        name: `${i}. ${ban.user.id} | ${ban.user.tag}`,
                        value: `Raison: \`${ban.reason}\``
                    });
                    i++;
                });
                interaction.reply({
                    embeds: [
                        embedBans
                    ]
                });
            }
        });
    }
};
