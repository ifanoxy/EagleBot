const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("autoreply-delete")
        .setDescription("Vous permet de supprimer une question de l'auto reply")
        .addStringOption(
            option => option.setName("question").setDescription("la question que vous souhaitez supprimer").setRequired(true).setAutocomplete(true)
        ),
    async autocomplete(interaction, client) {
        var guildData = client.managers.guildsManager.getIfExist(interaction.guildId, {
            guildId: interaction.guildId,
        });
        const focusedValue = interaction.options.getFocused();
        let choices = [];
        if (guildData.autoreply.length == 0) {
            choices.push("Vous n'avez pas créer d'auto reply --> /autoreply-create")
        } else {
            choices = guildData.autoreply.map(autorep => autorep.question)
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        ); 
    },
    execute(interaction, client) {
        const question = interaction.options.getString("question");
        if (question == "Vous n'avez pas créer d'auto reply --> /autoreply-create")return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Vous n'avez pas créer d'auto reply")
                .setColor("Blurple")
                .setDescription(`Utilisez la commande ${client.application.commands.cache.filter(i => i.name == "autoreply-create").map(a => `</${a.name}:${a.id}>`)} pour en créer`)
            ]
        });
        var guildData = client.managers.guildsManager.getIfExist(interaction.guildId, {
            guildId: interaction.guildId,
        });
        guildData.autoreply = guildData.autoreply.filter(a => a.question != question);
        guildData.save();

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Suppression d'un auto reply")
                .setColor("Red")
                .setDescription(`Vous avez retiré avec succès de l'auto reply la question :\n\`${question}\``)
            ]
        });
    }
}