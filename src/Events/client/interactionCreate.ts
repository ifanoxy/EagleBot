import {ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { EagleClient } from "../../structures/Client";

export default {
    name: "interactionCreate",
    execute(client: EagleClient, interaction) {
        switch (true) {
            case interaction.isAnySelectMenu() : {
                if (interaction.customId.startsWith("[no-check]"))return;

                const file = require(`../../Interactions/Selectmenus/${interaction.customId.split("#")[0]}.ts`).default;
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

                if (interaction.inGuild()) {
                    const NotPerm = client.hasNotPermissions(interaction);

                    if (NotPerm)return;
                }

                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }

                command.autocomplete(interaction, client);
            }break;
            case interaction.isButton() : {
                if (interaction.customId.startsWith("[no-check]")) return;


                const file = require(`../../Interactions/Buttons/${interaction.customId.split("#")[0]}.ts`).default;

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
                const logChannel = client.func.log.isActive(interaction.guildId, "BotCommands");
                if (logChannel) this.log(client, interaction, logChannel);
                const command = client.handlers.slashCommandsHandler.SlashCommandsList.get(interaction.commandName);

                if (interaction.inGuild()) {
                    const NotPerm = client.hasNotPermissions(interaction);

                    if (NotPerm) {
                        if (NotPerm == "owner") return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Orange')
                                    .setDescription(`Vous devez être owner pour utiliser cette commande !`)
                            ],
                            ephemeral: true
                        });
                        else if (NotPerm == "whitelist") return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor('Orange')
                                    .setDescription(`Vous devez être whitelist pour utiliser cette commande !`)
                            ],
                            ephemeral: true
                        });
                        else return interaction.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setColor('Orange')
                                        .setDescription(`Il vous manque la permission \`${NotPerm}\` pour utiliser cette commande !`)
                                ],
                                ephemeral: true
                            });
                    }
                }
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

                const file = require(`../../Interactions/Modals/${interaction.customId.split("#")[0]}.ts`).default;
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
    },

    log(client: EagleClient, interaction: ChatInputCommandInteraction, channel) {
        channel.send({
            embeds: [
                new EmbedBuilder().setColor("#2f3136").setTimestamp()
                    .setTitle(`Logs | Commands Used`)
                    .setDescription(
                        `**Commande:** </${interaction.commandName}:${interaction.id}>\n\n` +
                        `**Utilisé par:** <@${interaction.user.id}>`
                    )
            ]
        });
    }
}