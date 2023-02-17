import {AutocompleteInteraction, BaseInteraction, ButtonInteraction,
    ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, StringSelectMenuInteraction } from "discord.js";
import { EagleClient } from "../../structures/Client";

export default {
    name: "interactionCreate",
    execute(client: EagleClient, interaction) {
        switch (true) {
            case interaction.isAnySelectMenu() : {
                if (interaction.customId.startsWith("[no-check]")) return;

                const file = require(`../../Interactions/selectmenu/${interaction.customId.split("#")[0]}.js`);
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

                command.autocomplete(interaction, client);
            }break;
            case interaction.isButton() : {
                if (interaction.customId.startsWith("[no-check]")) return;

                const file = require(`../../Interactions/button/${interaction.customId.split("#")[0]}.js`);

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

                const NotPerm = client.hasNotPermissions(interaction);

                if (NotPerm) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Orange')
                            .setDescription(`Il vous manque la permission \`${NotPerm}\` pour utiliser cette commande !`)
                    ],
                    ephemeral: true
                });

                if (!command) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription("Cette commande n'existe pas !")
                    ],
                    ephemeral: true
                });

                command.execute(interaction, client);
            }break;
            case interaction.isModalSubmit() : {
                if (interaction.customId.startsWith("[no-check]")) return;

                const file = require(`../../Interactions/modal/${interaction.customId.split("#")[0]}.js`);
                if (!file) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Red')
                            .setDescription("Ce modal est introuvable !")
                    ],
                    ephemeral: true
                });
                try {
                    file.execute(interaction, client);
                } catch (err) {
                    client.error(err.stack)
                }
            }
        }
    }
}