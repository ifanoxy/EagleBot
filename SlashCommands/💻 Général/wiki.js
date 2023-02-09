const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const wiki = require("wikipedia");
const translate = require("translate")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("wiki")
    .setDescription("Permet de faire une recherche sur wikipedia")
    .addStringOption(
        opt => opt.setName("mots-clés").setDescription('Les mots clés pour votre recherche').setRequired(true)
    ),
    async execute(interaction, client) {
        const keyswords = interaction.options.getString("mots-clés")
        const page = await wiki.summary(keyswords)
        if (!page) return interaction.reply("Aucune donnée trouvé avec vos mots clés")
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Wikipédia : ${keyswords}`)
                .setDescription(`
                **Titre:** ${page.title}
                **Description:\n** ${(await translate(page.extract, {from: "en", to: "fr"})).replaceAll(".",".\n")}
                `)
                .setThumbnail(page?.thumbnail?.source)
                .setTimestamp()
                .setColor("White")
                .setFooter({text: "demandé par" + interaction.user.username, iconURL: interaction.user.avatarURL()})
            ]
        })
    }
}