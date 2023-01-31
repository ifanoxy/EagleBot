const { BaseInteraction, EmbedBuilder } = require('discord.js');
const { EagleClient } = require('../../structures/Client');
module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {BaseInteraction} interaction 
     * @param {EagleClient} client 
     */
    async execute(client, interaction) {
        switch(true) {
            case interaction.isAnySelectMenu() : {
                if (interaction.customId.startsWith("[no-check]")) return;

                const file = require(`../../interaction/selectmenu/${interaction.customId.split("#")[0]}.js`);
                if (!file) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("Ce selectMenu est introuvable !")
                    ],
                    ephemeral: true
                });

                file.execute(interaction, client);
            }break;
            case interaction.isAutocomplete() : {
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
            }break;
            case interaction.isButton() : {
                if (interaction.customId.startsWith("[no-check]")) return;

                const file = require(`../../interaction/button/${interaction.customId.split("#")[0]}.js`);
                if (!file) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("Ce bouton est introuvable !")
                    ],
                    ephemeral: true
                });

                file.execute(interaction, client);
            }break;
            case interaction.isChatInputCommand() : {
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
            }break;
            case interaction.isModalSubmit() : {
                if (interaction.customId.startsWith("[no-check]")) return;

                const file = require(`../../interaction/modal/${interaction.customId.split("#")[0]}.js`);
                if (!file) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("Ce modal est introuvable !")
                    ],
                    ephemeral: true
                });

                file.execute(interaction, client);
            }
        }
    }
}