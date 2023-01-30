const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageComponentInteraction, PermissionsBitField, Embed, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("permet de créer une configuration de ticket"),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        let fastButton = new ButtonBuilder()
        .setCustomId('[no-check]ticket_fast')
        .setStyle(ButtonStyle.Primary)
        .setLabel("Rapide");

        let advancedButton = new ButtonBuilder()
        .setCustomId('[no-check]ticket_advanced')
        .setStyle(ButtonStyle.Success)
        .setLabel('Avancée');

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Créateur de ticket personnalisable")
                .setColor("#2F3136")
                .setDescription("Vous avez 2 choix à votre disposition pour créer votre ticket.\n l'option rapide et l'option avancé.\n\nChoisissez celle qui vous convient le mieux selon vos envies !")
                .addFields(
                    {
                        name: "Option Rapide",
                        value: "Temps estimé: 2 minutes",
                        inline: true
                    },
                    {
                        name: "Option Avancée",
                        value: "Temps estimé: 5 minutes",
                        inline: true
                    },
                )
                .setFooter({text: "Vous avez 30s pour faire votre choix"})
            ],
            components: [
                new ActionRowBuilder().addComponents(fastButton, advancedButton)
            ],
            ephemeral: true,
        }).then(msg => {
            msg.awaitMessageComponent({
                componentType: ComponentType.Button,
                time: 30 * 1000,
                filter: i => i.customId.startsWith("[no-check]ticket")
            }).then(inter => {
                //#region fast option
                if (inter.customId == "[no-check]ticket_fast") {
                    ask(
                        [
                            new EmbedBuilder().setColor("Blue").setTitle("Création ticket rapide").setFooter({text: "Vous avez 30s pour répondre"})
                            .setDescription("Veuillez définir quel type de ticket voulez-vous.\n\n**Menu sélectif ou Bouton.**")
                        ],
                        [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder().setCustomId("[no-check]ticket-SelectMenu")
                                .setStyle(ButtonStyle.Primary).setLabel("Menu sélectif"),
                                new ButtonBuilder().setCustomId("[no-check]ticket-Button")
                                .setStyle(ButtonStyle.Primary).setLabel("Bouton")
                            )
                        ],
                        inter,
                        ComponentType.Button
                    )
                    .then(inter2 => {
                        //#region SelectMenu
                        let selectMenuChoix = new StringSelectMenuBuilder().setCustomId("[no-check]ticket_nombre_choix").setPlaceholder("Choissez le nombre d'options").setMaxValues(1)

                        if (inter2.customId == "[no-check]ticket-SelectMenu") {
                            for (let i = 1; i < 16; i++) {
                                selectMenuChoix.addOptions(
                                    {
                                        label: `${i} options`,
                                        value: i.toString()
                                    }
                                )
                            }
                        }
                        else {
                            for (let i = 1; i < 6; i++) {
                                selectMenuChoix.addOptions(
                                    {
                                        label: `${i} options`,
                                        value: i.toString()
                                    }
                                )
                            }
                        }
                        ask(
                            [
                                new EmbedBuilder().setColor("Blue").setTitle("Création ticket rapide").setFooter({text: "Vous avez 30s pour répondre"})
                                .setDescription("Veuillez définir le nombre de choix possible pour votre message de ticket")
                            ],
                            [
                                new ActionRowBuilder().addComponents(selectMenuChoix)
                            ],
                            inter2,
                            ComponentType.StringSelect
                        )
                        .then(inter3 => {
                            
                        })
                    })
                }
                //#endregion
                //#region advanced option
                else {

                }
                //#endregion
            }).catch(reason => {
                interaction.editReply({
                    components: [new ActionRowBuilder().addComponents(fastButton.setDisabled(true), advancedButton.setDisabled(true))]
                })
            })
        })

        /**
         * 
         * @param {Array<EmbedBuilder>} embed 
         * @param {Array<ActionRowBuilder>} components 
         * @param {MessageComponentInteraction} interaction 
         * @param {ComponentType} componentType 
         */
        function ask(embed, components, interaction, componentType) {
            return interaction.update({
                embeds: embed,
                components: components,
            })
            .then(msg => {
                return msg.awaitMessageComponent({
                    componentType: componentType,
                    time: 30 * 1000,
                    filter: i => i.customId.startsWith("[no-check]")
                })
                .then( inter => {
                    return inter
                }
                ).catch(reason => {components.map(row => row.components.map(component => component.setDisabled(true)))
                    interaction.editReply({
                        components: components
                    })
                })
            })
            .catch(err => client.error(err))
        }
    }
}