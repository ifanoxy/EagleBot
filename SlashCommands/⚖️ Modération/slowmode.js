const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("slow-mode")
    .setDescription("Permet d'ajouter un slow mode au channel actuel")
    .setDMPermission(false)
    .addStringOption(
        opt => opt.setName("délai").setDescription("le délai entre chaque message").setRequired(true).addChoices(
            { name: "Retirer", value: "0"},
            { name: "5 Secondes", value: "5"},
            { name: "10 Secondes", value: "10"},
            { name: "15 Secondes", value: "15"},
            { name: "30 Secondes", value: "30"},
            { name: "1 Minute", value: "60"},
            { name: "2 Minutes", value: "120"},
            { name: "5 Minutes", value: "300"},
            { name: "10 Minutes", value: "600"},
            { name: "15 Minutes", value: "900"},
            { name: "30 Minutes", value: "1800"},
            { name: "1 Heure", value: "3600"},
            { name: "2 Heures", value: "7200"},
            { name: "6 Heures", value: "21600"},
        )
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        const executor = interaction.member;
        if (!executor.permissions.has(PermissionsBitField.Flags.MuteMembers)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        interaction.channel.setRateLimitPerUser(Number(interaction.options.getString("délai")))
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Vous avez changer le slowmode de ce channel pour `" + interaction.options.getString("délai") + "` secondes")
                .setColor("Green")
            ]
        })
    }
}