const { CommandInteraction, EmbedBuilder } = require('discord.js');
const { EagleClient } = require('../../structures/Client');
module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    async execute(client, interaction) {
        if (!interaction.isChatInputCommand() && !interaction.isAutocomplete())return;
        if (interaction.isChatInputCommand()) {
            const command = client.handlers.slashCommandsHandler.SlashCommandsList.get(interaction.commandName);

            if (!command) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('Red')
                    .setDescription("Cette commande n'existe pas !")
                ],
                ephemeral: true
            });
    
            command.execute(interaction, client)
        }else if (interaction.isAutocomplete()) {
            const command = client.handlers.slashCommandsHandler.SlashCommandsList.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction, client);
            } catch (error) {
                console.error(error);
            }
        }
    }
}