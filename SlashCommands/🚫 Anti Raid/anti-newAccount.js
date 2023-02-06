const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('anti-newaccount')
    .setDescription("Vous permet d'interdire les membres trop récents")
    .setDMPermission(false)
    .addSubcommand(
        sub => sub.setName("off").setDescription("Permet de désactiver l'anti new account")
    )
    .addSubcommand(
        sub => sub.setName("on").setDescription("Permet d'activer l'anti new account")
        .addStringOption(
            opt => opt.setName('temps-minimum').setDescription("Le temps minimum de création du compte").setRequired(true)
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
            client.fonctions.desactivateAntiRaid("anti-newAccount", interaction, {status: false})
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez __Désactiver__ l'anti new account avec succès !")
                    .setColor("Orange")
                ],
                ephemeral: true
            })
        } else {
            client.fonctions.activateAntiRaid(
                "anti-newAccount", interaction,
                {
                    status: true,
                    ageMin: interaction.options.getBoolean("temps-minimum"),
                }
            )
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Vous avez __Activer__ l'anti new account avec succès !")
                    .setColor("Green")
                ],
                ephemeral: true
            })
        }
    }
}