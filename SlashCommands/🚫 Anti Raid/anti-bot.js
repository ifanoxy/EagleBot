const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('anti-bot')
    .setDescription("Vous permet d'interdire l'ajouts de bot dans votre serveur")
    .addSubcommand(
        sub => sub.setName("off").setDescription("Permet de désactiver l'anti bot")
    )
    .addSubcommand(
        sub => sub.setName("on").setDescription("Permet d'activer l'anti bot")
        .addStringOption(
            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui ajoute le bot").setRequired(true).addChoices(
                {name: "Derank", value: "derank"},
                {name: "kick", value: "kick"},
                {name: "ban", value: "ban"}
            )
        )
        .addBooleanOption(
            opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
        )
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        const sub = interaction.options.getSubcommand()
        if (sub === "off") {
            client.fonctions.desactivateAntiRaid("anti-bot", interaction, {status: false})
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez __Désactiver__ l'anti bot avec succès !")
                    .setColor("Orange")
                ],
                ephemeral: true
            })
        } else {
            client.fonctions.activateAntiRaid(
                "anti-bot", interaction,
                {
                    status: true,
                    ignoreWhitelist: interaction.options.getBoolean("ignore-whitelist"),
                    sanction: interaction.options.getString("sanction")
                }
            )
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez __Activer__ l'anti bot avec succès !")
                    .setColor("Green")
                ],
                ephemeral: true
            })
        }
    }
}