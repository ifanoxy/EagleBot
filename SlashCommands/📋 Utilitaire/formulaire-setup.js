const { SlashCommandBuilder, ActionRowBuilder, ComponentType, ButtonBuilder, EmbedBuilder, ModalBuilder, ButtonInteraction, CommandInteraction, PermissionsBitField, ButtonStyle, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, range, ChannelSelectMenuBuilder, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("formulaire-setup")
    .setDescription("Vous permet de créer des formulaires avec un modal")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {*} client 
     * @returns 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        askWithButton(
            [
                new EmbedBuilder()
                .setTitle("Création de formulaire")
                .setColor("Gold")
                .setDescription("**Souhaitez vous créer un nouveau formulaire ?**\n\nUn formulaire c'est un embed + un bouton qui ouvre un modal, les informations saisie par les utilisateurs dans le modal sont retranscrits dans un channel choisie.")
            ],
            [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]form_start")
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("Commencer"),
                    new ButtonBuilder()
                    .setCustomId("[no-check]form_cancel")
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Annuler")
                )
            ],
            interaction,
            null,
            true,
        )
        .then(inter => {
            askWithButtonToModal(
                [
                    new EmbedBuilder()
                    .setTitle("Veuillez définir l'embed de votre formulaire (ceci est le titre d'un embed)")
                    .setDescription(`
                    Petit rappel de ce que c'est un embed et de ce qui vous est demandé :

                    **Titre** : Obligatoire 
                    **Description** : Obligatoire | (Ceci est la description d'un embed)
                    **Couleur (hexa)** : Optionnel | valeur par défaut -> \`Random\` 
                    **Footer** : Optionnel | pas de valeur par défaut 
                    `)
                    .setColor("Blurple")
                    .setFooter({text: "Ceci est un footer"})
                ],
                [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId("[no-check]form_embed")
                        .setLabel("Cliquez pour ouvrir le modal")
                        .setStyle(ButtonStyle.Secondary)
                    )
                ],
                inter,
                new ModalBuilder()
                .setTitle("Form | Définission de l'embed")
                .setCustomId("[no-check]form_embed")
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                        .setCustomId("title")
                        .setLabel("Insérer le titre de l'embed")
                        .setMaxLength(256)
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                        .setCustomId("description")
                        .setLabel("Insérer la description de l'embed")
                        .setPlaceholder("(/p -> retour à la ligne)")
                        .setMaxLength(4000)
                        .setRequired(true)
                        .setStyle(TextInputStyle.Paragraph)
                    ),
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                        .setCustomId("color")
                        .setLabel("Insérer la couleur (hexa) de l'embed ")
                        .setRequired(false)
                        .setPlaceholder("couleur hexa -> #001122")
                        .setMaxLength(7)
                        .setStyle(TextInputStyle.Short)
                    ),  
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                        .setCustomId("footer")
                        .setLabel("Insérer le footer de l'embed ")
                        .setRequired(false)
                        .setMaxLength(2048)
                        .setStyle(TextInputStyle.Paragraph)
                    ), 
                ),
            )
            .then(inter2 => {
                const embedInput = new EmbedBuilder()
                    .setTitle("Veuillez définir ce que vous souhaitez demande avec votre formulaire")
                    .setDescription(`
                    Veuillez choisir le nombre de saisie de texte à mettre dans le formulaire via le menu sélectif.

                    Puis les définir avec les boutons qui vont s'activés.
                    `)
                    .setColor("Blurple");
                let SMInput = new ActionRowBuilder().addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId("[no-check]form_nbrTextInput")
                        .setPlaceholder("Choississez le nombre de saisie de texte")
                        .addOptions(
                            {
                                label: "1 saisie de texte",
                                value: "1",
                            },
                            {
                                label: "2 saisies de texte",
                                value: "2",
                            },
                            {
                                label: "3 saisies de texte",
                                value: "3",
                            },
                            {
                                label: "4 saisies de texte",
                                value: "4",
                            },
                            {
                                label: "5 saisies de texte",
                                value: "5",
                            },
                        )
                    );
                const title = inter2.fields.getTextInputValue("title");
                const description = inter2.fields.getTextInputValue("description");
                const color = inter2.fields.getTextInputValue("color");
                const footer = inter2.fields.getTextInputValue("footer");

                askWithSelectMenu(
                    [
                        embedInput
                    ],
                    [
                        SMInput
                    ],
                    inter2
                )
                .then(async inter3 => {
                    const nbrTextInput = Number(inter3.values[0]);
                    let TextInputData = [];
                    let interTemp = inter3;
                    for (let i of range(1, nbrTextInput)) {
                        await askWithButtonToModal(
                            [
                                embedInput
                            ],
                            [
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                    .setCustomId(`[no-check]form_opt_${i}`)
                                    .setLabel(`Cliquez pour définir la saisie de texte N°${i}`)
                                    .setStyle(ButtonStyle.Success)
                                )
                            ],
                            interTemp,
                            new ModalBuilder()
                            .setTitle(`Définission de la saisie de texte N°${i}`)
                            .setCustomId(`[no-check]SDT_${i}`)
                            .addComponents(
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                    .setCustomId("question")
                                    .setLabel("Quelle question voulez vous posez ?")
                                    .setMaxLength(45)
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                                ),
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                    .setCustomId("style")
                                    .setLabel("Quel style ? 1 (short) ou 2 (paragraph)")
                                    .setMaxLength(1)
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                                ),
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                    .setCustomId("required")
                                    .setLabel("Option obligatoire ? 1 (oui) ou 2 (non)")
                                    .setMaxLength(1)
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                                ),
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                    .setCustomId("max")
                                    .setLabel("Longeur maximal du texte (4000 max)")
                                    .setMaxLength(4)
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(false)
                                ),
                                new ActionRowBuilder().addComponents(
                                    new TextInputBuilder()
                                    .setCustomId("min")
                                    .setLabel("Longeur minimal du texte (1 minimum)")
                                    .setMaxLength(4)
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(false)
                                ),
                            )
                        )
                        .then(inter4 => {
                            interTemp = inter4;
                            TextInputData.push({
                                question: inter4.fields.getTextInputValue("question"),
                                style: inter4.fields.getTextInputValue("style") == "1" ? TextInputStyle.Short : TextInputStyle.Paragraph,
                                required: inter4.fields.getTextInputValue("required") == 1 ? true : false,
                                max: Number(inter4.fields.getTextInputValue("max")) < Number(inter4.fields.getTextInputValue("min")) ? 4000 : Number(inter4.fields.getTextInputValue("max")) > 4000 ? 4000 : Number(inter4.fields.getTextInputValue("max")) > 1 ? Number(inter4.fields.getTextInputValue("max")) : 1,
                                min: Number(inter4.fields.getTextInputValue("min")) > Number(inter4.fields.getTextInputValue("max")) ? 1 : Number(inter4.fields.getTextInputValue("min")) < 1 ? 1 : Number(inter4.fields.getTextInputValue("min")) < 4000 ? Number(inter4.fields.getTextInputValue("min")) : 4000,
                            });
                        });
                    }
                    
                    await askWithSelectMenu(
                        [
                            new EmbedBuilder()
                            .setColor("Greyple")
                            .setDescription("Veuillez définir le channel dans lequel **les formulaires remplies** seront envoyés.")
                        ],
                        [
                            new ActionRowBuilder().addComponents(
                                new ChannelSelectMenuBuilder()
                                .addChannelTypes(ChannelType.GuildText)
                                .setCustomId("[no-check]form_sendchannel")
                                .setMaxValues(1)
                                .setPlaceholder("Selectionnez le channel")
                            )
                        ],
                        interTemp
                    )
                    .then(inter5 => {
                        const form_sendchannel = inter5.values[0];

                        askWithSelectMenu(
                            [
                                new EmbedBuilder()
                                .setColor("Grey")
                                .setDescription("Veuillez définir le channel dans lequel le **message pour créer un formulaire** sera envoyé.")
                            ],
                            [
                                new ActionRowBuilder().addComponents(
                                    new ChannelSelectMenuBuilder()
                                    .addChannelTypes(ChannelType.GuildText)
                                    .setCustomId("[no-check]form_messagechannel")
                                    .setMaxValues(1)
                                    .setPlaceholder("Selectionnez le channel")
                                )
                            ],
                            inter5
                        )
                        .then(inter6 => {
                            const form_messageChannel = inter6.values[0];
                            let messageEmbed = new EmbedBuilder()
                                .setTitle(title)
                                .setDescription(description.replaceAll("/p", "\n"));
                            if (footer) messageEmbed.setFooter({text: footer});
                            if (color) messageEmbed.setColor(color | "Random");
                            else messageEmbed.setColor("Random");

                            interaction.guild.channels.cache.get(form_messageChannel).send({
                                embeds: [
                                    messageEmbed
                                ],
                            })
                            .then(msg => {
                                msg.edit({
                                    components: [
                                        new ActionRowBuilder().addComponents(
                                            new ButtonBuilder()
                                            .setStyle(ButtonStyle.Success)
                                            .setLabel("Créer un formulaire")
                                            .setCustomId(`formCreate#${msg.id}`)
                                        )
                                    ]
                                });
                                var guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
                                    guildId: interaction.guildId,
                                });
                                guildData.form[msg.id] = {
                                    data: TextInputData,
                                    channel: form_sendchannel
                                };
                                guildData.save()
                            })

                            inter6.update({
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle("Vous avez terminé la création du formulaire !")
                                ],
                                components: [],
                                ephemeral: true
                            });
                        })
                    });
                });
            });
        });
        

        /**
         * 
         * @param {Array<EmbedBuilder>} embed 
         * @param {Array<ActionRowBuilder<ButtonBuilder>>} components 
         * @param {ButtonInteraction} interaction 
         * @param {ModalBuilder} modal 
         * @param {Number} time 
         * @param {Boolean} firstSend
         * @param {Boolean} ephemeral
         * @returns 
         */
        function askWithButtonToModal(embed, components, interaction, modal, time = 30, reply = false, ephemeral = true) {
            if (reply) {
                var inter0 = interaction.reply({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                })
            } else {
                var inter0 = interaction.update({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                })
            }   
            return inter0.then(msg => {
                return msg.awaitMessageComponent({
                    componentType: ComponentType.Button,
                    time: time * 1000,
                    filter: i => i.customId.startsWith("[no-check]")
                })
                .then(inter => {
                    inter.showModal(modal)
                    return inter.awaitModalSubmit({
                        time: 90 * 1000,
                        filter: i => i.customId.startsWith("[no-check]"),
                    })
                    .then(inter2 => {
                        return inter2
                    })
                    .catch(() => {
                        components.map(row => row.components.map(component => component.setDisabled(true)))
                        interaction.editReply({
                            components: components
                        });
                    })
                }
                ).catch(() => {
                    components.map(row => row.components.map(component => component.setDisabled(true)))
                    interaction.editReply({
                        components: components
                    });
                })
            })
            .catch(err => client.error(err))
        };

        /**
         * 
         * @param {Array<EmbedBuilder>} embed 
         * @param {Array<ActionRowBuilder<ButtonBuilder>>} components 
         * @param {ButtonInteraction} interaction 
         * @param {Number} time 
         * @param {Boolean} firstSend
         * @param {Boolean} ephemeral
         * @returns 
         */
        function askWithButton(embed, components, interaction, time = 30, reply = false, ephemeral = true) {
            if (reply) {
                var inter = interaction.reply({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                })
            } else {
                var inter = interaction.update({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                })
            }
            return inter.then(msg => {
                return msg.awaitMessageComponent({
                    componentType: ComponentType.Button,
                    time: time * 1000,
                    filter: i => i.customId.startsWith("[no-check]")
                })
                .then(inter => {
                    return inter
                }
                ).catch(reason => {
                    components.map(row => row.components.map(component => component.setDisabled(true)))
                    interaction.editReply({
                        components: components
                    });
                    return null
                })
            })
        }
        /**
         * 
         * @param {Array<EmbedBuilder>} embed 
         * @param {Array<ActionRowBuilder<StringSelectMenuBuilder>>} components 
         * @param {ButtonInteraction} interaction 
         * @param {Number} time 
         * @param {Boolean} firstSend
         * @param {Boolean} ephemeral
         * @returns 
         */
        function askWithSelectMenu(embed, components, interaction, time = 30, reply = false, ephemeral = true) {
            if (reply) {
                var inter = interaction.reply({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                })
            } else {
                var inter = interaction.update({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                })
            }
            return inter.then(msg => {
                return msg.awaitMessageComponent({
                    time: time * 1000,
                    filter: i => i.customId.startsWith("[no-check]")
                })
                .then(inter => {
                    return inter
                }
                ).catch(reason => {
                    components.map(row => row.components.map(component => component.setDisabled(true)))
                    interaction.editReply({
                        components: components
                    });
                    return null
                })
            })
        }
    }
}