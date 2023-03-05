import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelSelectMenuBuilder,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder
} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("greet-ping")
        .setDescription("Permet de ping un membre lorse qu'il rejoint")
        .setDMPermission(false),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        let guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {guildId: interaction.guildId})

        interaction.reply({
            embeds: [
                createEmbed()
            ],
            components: [
                createRow()
            ],
            fetchReply: true
        }).then(message => {
            mainGreetPing(message)
        });

        function mainGreetPing(message) {
            client.func.utils.askWithButton(message)
                .then(inter => {
                    if(!inter)return;
                    switch (inter.customId.replace("[no-check]greet-","")) {
                        case "desactivate" : {
                            guildData.greetPing.status = false;
                            guildData.save();
                            return inter.update({
                                embeds: [
                                    createEmbed()
                                ],
                                components: [
                                    createRow()
                                ]
                            }).then(mainGreetPing);
                        }
                        case "activate" : {
                            guildData.greetPing.status = true;
                            guildData.save();
                            return inter.update({
                                embeds: [
                                    createEmbed()
                                ],
                                components: [
                                    createRow()
                                ]
                            }).then(mainGreetPing);
                        }
                        case "addchannel" : {
                            return inter.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle("Greet Ping | Ajout de Channel")
                                        .setDescription("Vous pouvez ajouter jusqu'à 15 channels aux maximum !")
                                        .setFooter({text: "Vous avez 2 minutes pour choisir vos channels"})
                                        .setColor("Gold")
                                ],
                                components: [
                                    new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(
                                        new ChannelSelectMenuBuilder()
                                            .setChannelTypes([ChannelType.GuildText, ChannelType.GuildAnnouncement])
                                            .setCustomId("[no-check]greet-addchannel")
                                            .setMinValues(1)
                                            .setMaxValues(15 - guildData.greetPing.channels?.length)
                                    )
                                ]
                            })
                                .then(message => {
                                    return client.func.utils.askWithSelectMenuChannel(message, 120)
                                        .then(inter2 => {
                                            if (!inter2)return;
                                            guildData.greetPing.channels?.push(...inter2.values);
                                            guildData.save();
                                            inter2.message.delete();
                                            return interaction.editReply({
                                                embeds: [
                                                    createEmbed()
                                                ],
                                                components: [
                                                    createRow()
                                                ]
                                            }).then(mainGreetPing);
                                        })
                                })
                        }
                        case "removechannel" : {
                            return inter.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle("Greet Ping | Suppression de Channel")
                                        .setFooter({text: "Vous avez 2 minutes pour choisir vos channels"})
                                        .setColor("Gold")
                                ],
                                components: [
                                    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                                        new StringSelectMenuBuilder()
                                            .setCustomId("[no-check]greet-removechannel")
                                            .addOptions(
                                                guildData.greetPing.channels.map(channelId => {
                                                    return {
                                                        label: interaction.guild.channels.cache.get(channelId).name,
                                                        value: channelId,
                                                    }
                                                })
                                            )
                                            .setMinValues(1)
                                            .setMaxValues(guildData.greetPing.channels?.length)
                                    )
                                ]
                            })
                                .then(message => {
                                    return client.func.utils.askWithSelectMenuString(message, 120)
                                        .then(inter2 => {
                                            if (!inter2)return;
                                            guildData.greetPing.channels = guildData.greetPing?.channels?.filter(m => !inter2.values.includes(m));
                                            guildData.save();
                                            inter2.message.delete();
                                            return interaction.editReply({
                                                embeds: [
                                                    createEmbed()
                                                ],
                                                components: [
                                                    createRow()
                                                ]
                                            }).then(mainGreetPing);
                                        })
                                })
                        }
                        case "end" : {
                            return inter.update({
                                embeds: [
                                    createEmbed().setColor("Green")
                                ],
                                components: []
                            })
                        }
                    }
                });
        }
        function createEmbed() {
            return new EmbedBuilder()
                .setTitle("Gestion des notifications automatiques pour les arrivants")
                .setDescription("Les 'greet-ping' sont des notifications qui sont envoyé dans des channels prédéfinis et qui sont supprimés 2 secondes après.")
                .addFields(
                    {
                        name: "Status",
                        value: guildData.greetPing?.status ? "``Actif``" : "``Inactif``"
                    },
                    {
                        name: "Channel",
                        value: guildData.greetPing?.channels?.map(c => `<#${c}>`).join("\n") || "Aucun Channel"
                    }
                )
                .setColor("Blurple")
        }


        function createRow() {
            let greetRow = new ActionRowBuilder<ButtonBuilder>()

            if (guildData.greetPing?.status)
            {
                greetRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId("[no-check]greet-desactivate")
                        .setLabel("Désactiver")
                        .setStyle(ButtonStyle.Danger)
                )
            }
            else
            {
                greetRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId("[no-check]greet-activate")
                        .setLabel("Activer")
                        .setStyle(ButtonStyle.Success)
                )
            }

            if (guildData?.greetPing.channels?.length >= 15)
            {
                greetRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId("[no-check]greet-addchannel")
                        .setLabel("Ajouter un channel")
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                )
            } else {
                greetRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId("[no-check]greet-addchannel")
                        .setLabel("Ajouter un channel")
                        .setStyle(ButtonStyle.Primary)
                )
            }

            if (guildData?.greetPing.channels?.length == 0)
            {
                greetRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId("[no-check]greet-removechannel")
                        .setLabel("Retirer un channel")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                )
            } else {
                greetRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId("[no-check]greet-removechannel")
                        .setLabel("Retirer un channel")
                        .setStyle(ButtonStyle.Secondary)
                )
            }

            greetRow.addComponents(
                new ButtonBuilder()
                    .setCustomId("[no-check]greet-end")
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Terminer")
            )

            return greetRow
        }
    }
}