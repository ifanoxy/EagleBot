const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("calc")
    .setDescription("Vous permet de résoudre des calculs")
    .addStringOption(
        opt => opt.setName("calcul").setDescription("Définissez le calcul que vous souhaitez résoudre").setRequired(true)
    ),
    execute(interaction, client) {
        const calcul = interaction.options.getString("calcul")
        interaction.reply(`le calcul **${calcul.replaceAll("*", "\\*")}** est égal à **${eval(calcul)}**`)
    }
}