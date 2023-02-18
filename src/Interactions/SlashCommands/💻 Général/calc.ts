import {SlashCommandBuilder } from "discord.js";
import { EagleClient } from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
    .setName("calc")
    .setDescription("Vous permet de résoudre des calculs")
    .addStringOption(
        opt => opt.setName("calcul").setDescription("Définissez le calcul que vous souhaitez résoudre").setRequired(true)
    ),
    execute(interaction, client: EagleClient) {
        const calcul = interaction.options.getString("calcul")
        interaction.reply(`le calcul **${calcul.replaceAll("*", "\\*")}** est égal à **${eval(calcul)}**`)
    }
}