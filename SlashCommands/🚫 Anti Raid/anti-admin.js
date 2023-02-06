const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('anti-admin')
    .setDescription("Vous permet d'interdire l'ajouts de la permission Admin")
    .addSubcommand(
        sub => sub.setName("off").setDescription("Permet de désactiver l'anti admin")
    )
    .addSubcommand(
        sub => sub.setName("on").setDescription("Permet d'activer l'anti admin")
        .addStringOption(
            opt => opt.setName('sanction').setDescription("La sanction que prendra le membre qui ajoute le admin").setRequired(true).addChoices(
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
            client.fonctions.desactivateAntiRaid("anti-admin", interaction, {status: false})
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez __Désactiver__ l'anti admin avec succès !")
                    .setColor("Orange")
                ],
                ephemeral: true
            })
        } else {
            client.fonctions.activateAntiRaid(
                "anti-admin", interaction,
                {
                    status: true,
                    ignoreWhitelist: interaction.options.getBoolean("ignore-whitelist"),
                    sanction: interaction.options.getString("sanction")
                }
            )
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez __Activer__ l'anti admin avec succès !")
                    .setColor("Green")
                ],
                ephemeral: true
            })
        }
    }
}