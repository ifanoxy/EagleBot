import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    RoleSelectMenuBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder
} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
    data: new SlashCommandBuilder()
        .setName("autoroles")
        .setDMPermission(false)
        .setDescription("Permet de définir quels rôles seront ajoutés automatiquement"),
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
            mainAutoRoles(message)
        });

        function mainAutoRoles(message) {
            client.func.utils.askWithButton(message)
                .then(inter => {
                    if(!inter)return;
                    switch (inter.customId.replace("[no-check]autoroles-","")) {
                        case "addrole" : {
                            return inter.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle("autoroles Ping | Ajout de role")
                                        .setDescription("Vous pouvez ajouter jusqu'à 15 roles aux maximum !")
                                        .setFooter({text: "Vous avez 2 minutes pour choisir vos roles"})
                                        .setColor("Gold")
                                ],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new RoleSelectMenuBuilder()
                                            .setCustomId("[no-check]autoroles-addrole")
                                            .setMinValues(1)
                                            .setMaxValues(15 - (guildData.autoroles?.length || 0))
                                    )
                                ]
                            })
                                .then(message => {
                                    return client.func.utils.askWithSelectMenuRole(message, 120)
                                        .then(inter2 => {
                                            if (!inter2)return;
                                            guildData.autoroles?.push(...inter2.values);
                                            guildData.save();
                                            inter2.message.delete();
                                            return interaction.editReply({
                                                embeds: [
                                                    createEmbed()
                                                ],
                                                components: [
                                                    createRow()
                                                ]
                                            }).then(mainAutoRoles);
                                        })
                                })
                        }
                        case "removerole" : {
                            return inter.reply({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle("autoroles Ping | Suppression de role")
                                        .setFooter({text: "Vous avez 2 minutes pour choisir vos roles"})
                                        .setColor("Gold")
                                ],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new StringSelectMenuBuilder()
                                            .setCustomId("[no-check]autoroles-removerole")
                                            .addOptions(
                                                guildData.autoroles?.map(roleId => {
                                                    return {
                                                        label: interaction.guild.roles.cache.get(roleId).name,
                                                        value: roleId,
                                                    }
                                                })
                                            )
                                            .setMinValues(1)
                                            .setMaxValues(guildData.autoroles?.length || 0)
                                    )
                                ]
                            })
                                .then(message => {
                                    return client.func.utils.askWithSelectMenuString(message, 120)
                                        .then(inter2 => {
                                            if (!inter2)return;
                                            guildData.autoroles = guildData.autoroles?.filter(m => !inter2.values.includes(m));
                                            guildData.save();
                                            inter2.message.delete();
                                            return interaction.editReply({
                                                embeds: [
                                                    createEmbed()
                                                ],
                                                components: [
                                                    createRow()
                                                ]
                                            }).then(mainAutoRoles);
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
                .setTitle("Gestion des auto roles pour les arrivants")
                .setDescription("Les 'autoroles' sont des roles qui sont donnés automatiquement à un membre lorse qu'il rejoint.")
                .addFields(
                    {
                        name: "Status",
                        value: guildData.autoroles?.length > 0 ? "``Actif``" : "``Inactif``"
                    },
                    {
                        name: "Roles",
                        value: guildData.autoroles?.map(c => `<@&${c}>`).join("\n") || "Aucun Roles"
                    }
                )
                .setColor("Blurple")
        }


        function createRow() {
            let autorolesRow = new ActionRowBuilder<ButtonBuilder>()

            if (guildData.autoroles?.length >= 15)
            {
                autorolesRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId("[no-check]autoroles-addrole")
                        .setLabel("Ajouter un role")
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                )
            } else {
                autorolesRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId("[no-check]autoroles-addrole")
                        .setLabel("Ajouter un role")
                        .setStyle(ButtonStyle.Primary)
                )
            }

            if (guildData.autoroles?.length == 0)
            {
                autorolesRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId("[no-check]autoroles-removerole")
                        .setLabel("Retirer un role")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                )
            } else {
                autorolesRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId("[no-check]autoroles-removerole")
                        .setLabel("Retirer un role")
                        .setStyle(ButtonStyle.Secondary)
                )
            }

            autorolesRow.addComponents(
                new ButtonBuilder()
                    .setCustomId("[no-check]autoroles-end")
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Terminer")
            )

            return autorolesRow
        }
    }
}