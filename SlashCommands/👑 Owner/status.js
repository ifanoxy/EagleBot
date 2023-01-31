const { SlashCommandBuilder, ActivityType, CommandInteraction, EmbedBuilder } = require("discord.js");
const { EagleClient } = require('../../structures/Client');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Vous permet de modifier le status du bot")
    .addStringOption(
        opt => opt.setName('activité').setDescription("Définissez l'activité").setRequired(true).addChoices(
            {name: "Joue à", value: `${ActivityType.Playing}`},
            {name: "Ecoute", value: `${ActivityType.Listening}`},
            {name: "Regarde", value: `${ActivityType.Watching}`},
        )
    )
    .addStringOption(
        opt => opt.setName("status").setDescription("Définissez le status (ce qu'il y a après le 'Joue à')").setRequired(true)
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        const activite = interaction.options.getString("activité");
        const status = interaction.options.getString("status");

        client.user.setActivity({
            type: Number(activite),
            name: status,
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Aqua")
                .setTitle("Modification du status du bot")
                .setDescription(`Status: \`${activite == 3 ? "Regarde" : activite == 2 ? "Ecoute" : "joue à"} ${status}\``)
            ]
        })
    }
}