const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("reaction-role")
    .setDescription("Vous permet de gérer les réactions role pour votre serveur")
    .setDMPermission(false)
    .addSubcommand(
        sub => sub
        .setName("bouton")
        .setDescription("vous permet de créer un reaction role avec des boutons")
        .addIntegerOption(
            opt => opt.setName("nombre-boutons").setDescription("le nombre de boutons").setRequired(true).setMaxValue(25).setMinValue(1)
        )
        .addStringOption(
            opt => opt.setName("type").setDescription("le type de reaction role").addChoices(
                {name: "Normal", value: 'normal'},
                {name: "Ajoute Seulement", value: 'onlyAdd'},
                {name: "Retire Seulement", value: 'onlyRemove'},
            )
        )
    )
    .addSubcommand(
        sub => sub
        .setName("select-menu")
        .setDescription("vous permet de créer un reaction role avec un select menu")
        .addIntegerOption(
            opt => opt.setName("nombre-options").setDescription("le nombre d'options dans le selectMenu").setRequired(true).setMaxValue(15).setMinValue(1)
        )
        .addStringOption(
            opt => opt.setName("type").setDescription("le type de reaction role").addChoices(
                {name: "Normal", value: 'normal'},
                {name: "Ajoute Seulement", value: 'onlyAdd'},
                {name: "Retire Seulement", value: 'onlyRemove'},
            )
        )
    )
    .addSubcommand(
        sub => sub
        .setName("emoji")
        .setDescription("vous permet de créer un reaction role avec des émojis")
        .addIntegerOption(
            opt => opt.setName("nombre-émojis").setDescription("le nombre d'émojies pour le reaction role.").setRequired(true).setMaxValue(20).setMinValue(1)
        )
        .addStringOption(
            opt => opt.setName("type").setDescription("le type de reaction role").addChoices(
                {name: "Normal", value: 'normal'},
                {name: "Ajoute Seulement", value: 'onlyAdd'},
                {name: "Retire Seulement", value: 'onlyRemove'},
            )
        )
    )
}