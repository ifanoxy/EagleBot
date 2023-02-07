const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("embed-create")
    .setDescription("Vous permet de créer un embed")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Créateur d'embed")
                .setDescription(`
                **Vous avez 2 possibilités de création d'embed :**
                1. Rapide (environ 2 minutes de création)
                2. Avancé (environ 5 minutes de création)

                Vous pourrez ensuite envoyer cette embed et/ou le sauvegarder
                pour le réutiliser pour tard !
                `)
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]embed_short")
                    .setLabel("Rapide")
                    .setStyle(ButtonStyle.Primary)
                )
            ],
            ephemeral: true
        })
    }
}