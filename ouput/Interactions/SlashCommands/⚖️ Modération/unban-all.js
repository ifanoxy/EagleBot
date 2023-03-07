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
        .setName("unban-all")
        .setDescription("Permet de débannir tout les membres du serveur")
        .setDMPermission(false),
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const bans = yield interaction.guild.bans.fetch();
            if (bans.size == 0)
                return interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder().setDescription("Il y a personne de banni sur ce serveur !").setColor("Red")
                    ],
                    ephemeral: true
                });
            interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder().setDescription(`Débannissement de \`${bans.size}\` utilisateurs en cours...`).setColor("Purple")
                ]
            }).then(() => {
                bans.map(ban => interaction.guild.bans.remove(ban.user.id, `Demandé par ${interaction.user.tag} (${interaction.user.id}) | Unban All`).catch());
                interaction.editReply({
                    embeds: [
                        new discord_js_1.EmbedBuilder().setDescription(`Débannissement de \`${bans.size}\` utilisateurs effectués !`).setColor("Blurple")
                    ]
                });
            });
        });
    }
};
