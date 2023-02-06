const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('anti-masskick')
    .setDescription("Vous permet d'interdire le kick massif")
    .setDMPermission(false)
    .addSubcommand(
        sub => sub.setName("off").setDescription("Permet de désactiver l'anti mass kick")
    )
    .addSubcommand(
        sub => sub.setName("on").setDescription("Permet d'activer l'anti mass kick")
        .addStringOption(
            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui kick trop de personne").setRequired(true).addChoices(
                {name: "Derank", value: "derank"},
                {name: "kick", value: "kick"},
                {name: "kick", value: "kick"}
            )
        )
        .addBooleanOption(
            opt => opt.setName("ignore-whitelist").setDescription("True: les whitelists ne seront pas sanctionnés").setRequired(true)
        )
        .addStringOption(
            opt => opt.setName("frequence").setDescription("l'intervale de temps entre les kick. ex: '5/15s' ").setRequired(true)
        )
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        if (!client.moderation.checkOwner(interaction.member.id)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous devez être owner pour utiliser cette commande !")
            ],
            ephemeral: true
        });
        
        const sub = interaction.options.getSubcommand()
        if (sub === "off") {
            client.fonctions.desactivateAntiRaid("anti-massKick", interaction, {status: false})
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez __Désactiver__ l'anti mass kick avec succès !")
                    .setColor("Orange")
                ],
                ephemeral: true
            })
        } else {
            client.fonctions.activateAntiRaid(
                "anti-massKick", interaction,
                {
                    frequence: interaction.options.getString("freqence"),
                    status: true,
                    ignoreWhitelist: interaction.options.getBoolean("ignore-whitelist"),
                    sanction: interaction.options.getString("sanction")
                }
            )
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez __Activer__ l'anti mass kick avec succès !")
                    .setColor("Green")
                ],
                ephemeral: true
            })
        }
    }
}