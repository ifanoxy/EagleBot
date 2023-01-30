const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, MessageComponentInteraction, PermissionsBitField, Embed, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

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

        let startButton = new ButtonBuilder()
        .setCustomId('[no-check]ticket_start')
        .setStyle(ButtonStyle.Success)
        .setLabel("Commencer");

        let cancelButton = new ButtonBuilder()
        .setCustomId('[no-check]ticket_cancel')
        .setStyle(ButtonStyle.Danger)
        .setLabel('Annuler');

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle("Créateur de ticket personnalisable")
                .setColor("#2F3136")
                .setDescription("Vous pouvez créer un système de ticket 100% personnalisable.\nLa commande que vous venez d'effectuer vous permet de créer un 'template' de ticket que vous pourrez réutiliser le nombre de fois que vous le souhaitez !")
                .addFields(
                    {
                        name: "Temps estimé",
                        value: "entre 2 minutes et 5 minutes",
                        inline: true
                    },
                )
                .setFooter({text: "Vous avez 30s pour faire votre choix"})
            ],
            components: [
                new ActionRowBuilder().addComponents(startButton, cancelButton)
            ],
            ephemeral: true,
        }).then(msg => {
            msg.awaitMessageComponent({
                componentType: ComponentType.Button,
                time: 30 * 1000,
                filter: i => i.customId.startsWith("[no-check]ticket")
            }).then(inter => {
                if (inter.customId == "[no-check]ticket_start") {
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
                        //#region Nombre de choix
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
                        .then(async inter3 => {
                            //#region définission des options
                            let options = []
                            let interactionNow = inter3
                            for (let i = 1; i < Number(inter3.values[0])+1; i++) {
                                if (inter2.customId == "[no-check]ticket-SelectMenu") {
                                    await interactionNow.update({
                                        embeds: [
                                            new EmbedBuilder()
                                            .setColor("Blue")
                                            .setTitle(`Définission des options ${i}/${inter3.values[0]}`)
                                            .setFooter({text: "Vous avez 1m30 pour répondres"})
                                            .setDescription("Définissez l'options avec le nom, une description, le placeholder, l'émoji.")
                                        ],
                                        components: [
                                            new ActionRowBuilder().addComponents(
                                                new ButtonBuilder()
                                                .setStyle(ButtonStyle.Success)
                                                .setLabel(`Cliquez pour définir l'option N°${i}`)
                                                .setCustomId("[no-check]")
                                            ),
                                        ]
                                    })
                                    .then(msg => {
                                        return msg.awaitMessageComponent({
                                            componentType: ComponentType.Button,
                                            time: 30 * 1000,
                                            filter: i => i.customId.startsWith("[no-check]")
                                        })
                                        .then(interTemp => {
                                            const ModalOption = new ModalBuilder()
                                                .setCustomId("[no-check]ticket_define_choice")
                                                .setTitle(`Définission des options ${i}/${inter3.values[0]}`)
                                                .addComponents(
                                                    new ActionRowBuilder().addComponents(
                                                        new TextInputBuilder()
                                                        .setCustomId("name")
                                                        .setLabel("Quel est le nom de cette option ?")
                                                        .setStyle(TextInputStyle.Short)
                                                        .setMaxLength(90)
                                                        .setRequired(true)
                                                    ),
                                                    new ActionRowBuilder().addComponents(
                                                        new TextInputBuilder()
                                                        .setCustomId("description")
                                                        .setLabel("Définissez une petite description")
                                                        .setStyle(TextInputStyle.Short)
                                                        .setMaxLength(90)
                                                        .setRequired(true)
                                                    ),
                                                    new ActionRowBuilder().addComponents(
                                                        new TextInputBuilder()
                                                        .setCustomId("emoji")
                                                        .setLabel("Définissez un émoji (Optionnel)")
                                                        .setStyle(TextInputStyle.Short)
                                                        .setMaxLength(90)
                                                        .setRequired(false)
                                                    )
                                                )
                                            if (i == 1 ) {
                                                ModalOption.addComponents(
                                                    new ActionRowBuilder().addComponents(
                                                        new TextInputBuilder()
                                                        .setCustomId("placeholder")
                                                        .setLabel("Définissez le placeHolder")
                                                        .setStyle(TextInputStyle.Short)
                                                        .setMaxLength(90)
                                                        .setRequired(false)
                                                    )
                                                )
                                            }
                                            interTemp.showModal(ModalOption)
    
                                            return interTemp.awaitModalSubmit({
                                                filter: i => i.customId == "[no-check]ticket_define_choice",
                                                time: 2 * 60 * 1000,
                                            })
                                            .then(interTemp2 => {
                                                interactionNow = interTemp2
                                                const name = interTemp2.fields.getTextInputValue("name")
                                                const description = interTemp2.fields.getTextInputValue("description")
                                                const emoji = interTemp2.fields.getTextInputValue("emoji")
                                                if (i == 1 ) {
                                                    const placeHolder = interTemp2.fields.getTextInputValue("placeholder")
                                                    options.push({
                                                        name: name,
                                                        description: description,
                                                        emoji: emoji || null,
                                                        placeHolder: placeHolder || null
                                                    });
                                                } else {
                                                    options.push({
                                                        name: name,
                                                        description: description,
                                                        emoji: emoji || null
                                                    });
                                                };
                                                return 1
                                            });
                                        })
                                        .catch(reason => {components.map(row => row.components.map(component => component.setDisabled(true)))
                                            interaction.editReply({
                                                components: components
                                            });
                                            return 0
                                        })
                                    })
                                    .catch(err => client.error(err))
                                } else {
                                    ask(
                                        [
                                            new EmbedBuilder()
                                            .setColor("Blue")
                                            .setTitle(`Définission des options ${i}/${inter3.values[0]}`)
                                            .setFooter({text: "Vous avez 1m30 pour répondres"})
                                            .setDescription("Définissez l'options avec le nom, une description, la couleur du bouton, l'émoji.")
                                        ],
                                        [
                                            new ActionRowBuilder().addComponents(
                                                new ButtonBuilder()
                                                .setStyle(ButtonStyle.Success)
                                                .setLabel(`Cliquez pour définir l'option N°${i}`)
                                                .setCustomId("[no-check]")
                                            )
                                        ],
                                        interactionNow,
                                        ComponentType.Button,
                                        90
                                    )
                                    .then(interTemp => {
                                        interTemp.showModal(
                                            new ModalBuilder().addComponents(
                                                new ActionRowBuilder().addComponents(

                                                ),
                                                new ActionRowBuilder().addComponents(

                                                ),
                                                new ActionRowBuilder().addComponents(

                                                ),
                                            )
                                        );
                                    });
                                };
                            };
                            interactionNow.update({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle("Vous avez terminé la création de votre Ticket")
                                    .setDescription("Vous pouvez Utiliser ce 'template' en cliquant sur le bouton ci-dessous ou bien avec la commande /ticket-utiliser")
                                    .setColor("Green")
                                ]
                            })

                            let database = client.managers.ticketsManager.getAndCreateIfNotExists(interaction.user.id, {
                                userId: interaction.user.id,
                            });
                            database.data[`${interaction.user.id}_${Object.keys(database.data).length}`] = options;
                            database.save();
                            //#endregion
                        })
                        //#endregion
                    })
                } else {

                }
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
        function ask(embed, components, interaction, componentType, time = 30) {
            return interaction.update({
                embeds: embed,
                components: components,
            })
            .then(msg => {
                return msg.awaitMessageComponent({
                    componentType: componentType,
                    time: time * 1000,
                    filter: i => i.customId.startsWith("[no-check]")
                })
                .then(inter => {
                    return inter
                }
                ).catch(reason => {components.map(row => row.components.map(component => component.setDisabled(true)))
                    interaction.editReply({
                        components: components
                    });
                })
            })
            .catch(err => client.error(err))
        }
    }
}