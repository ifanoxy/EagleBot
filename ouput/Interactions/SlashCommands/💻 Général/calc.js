"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("calc")
        .setDescription("Vous permet de résoudre des calculs")
        .addStringOption(opt => opt.setName("calcul").setDescription("Définissez le calcul que vous souhaitez résoudre").setRequired(true)),
    execute(interaction, client) {
        const calcul = interaction.options.getString("calcul");
        try {
            interaction.reply(`le calcul **${calcul.replaceAll("*", "\\*")}** est égal à **${eval(calcul)}**`);
        }
        catch (_a) {
            interaction.reply(`Votre calcul est incorrecte`);
        }
    }
};
