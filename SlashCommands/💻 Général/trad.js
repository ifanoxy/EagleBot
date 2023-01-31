const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const translate = require("translate")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("traduire")
    .setDescription("Permet de string une phrase ou un mot")
    .addStringOption(
        opt => opt.setName("texte").setDescription("insérez le texte à traduire").setRequired(true)
    )
    .addStringOption(
        opt => opt.setName("langue-sortie").setDescription("insérez la langue de traduction (es, en, de, etc)").setRequired(true)
    )
    .addStringOption(
        opt => opt.setName("langue-entree").setDescription("défaut --> fr").setRequired(false)
    ),
    async execute(interaction, client) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Gold")
                .setDescription(`**Traduction de ${interaction.options.getString('langue-entree') || "fr"} à ${interaction.options.getString('langue-sortie')}**\n\n**Phrase entrée :**\n> ${interaction.options.getString('texte')}\n\n**Phrase sortie:**\n> ${await translate(interaction.options.getString('texte'), {from: interaction.options.getString('langue-entree') || "fr", to: interaction.options.getString('langue-sortie')})}`)
                .setFooter({text: "traduit par Deepl"})
            ]
        })
    }
}