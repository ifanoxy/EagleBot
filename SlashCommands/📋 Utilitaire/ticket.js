const { SlashCommandBuilder, ChannelType, ButtonBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, ButtonStyle, TextInputBuilder, TextInputStyle, ModalBuilder, Embed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Vous permet de gérer le ticket pour votre serveur.")
    .setDMPermission(false)
    .addSubcommand(
        sub => sub
        .setName("setup")
        .setDescription("permet de créer une configuration de ticket")
    )
    .addSubcommand(
        sub => sub
        .setName("use")
        .setDescription("Permet d'utiliser un template de ticket")
        .addStringOption(
            option => option.setName("template").setDescription("Quel template souhaitez vous utiliser").setAutocomplete(true).setRequired(true)
        )
        .addChannelOption(
            option => option.setName("catégorie").setDescription("La catégorie où seront créer les tickets").addChannelTypes(ChannelType.GuildCategory)
        )
    )
    .addSubcommand(
        sub => sub
        .setName("delete")
        .setDescription("Permet de supprimer un template de ticket")
        .addStringOption(
            option => option.setName("template").setDescription("Quel template souhaitez vous supprimer").setAutocomplete(true).setRequired(true)
        )
    )
    .addSubcommand(
        sub => sub
        .setName("list")
        .setDescription("Permet de voir la liste de tout vos 'template' de ticket")   
    ),
    async autocomplete(interaction, client) {
        const userData = client.managers.ticketsManager.getIfExist(interaction.user.id, {
            userId: interaction.user.id,
        });
        const focusedValue = interaction.options.getFocused();
		let choices = [];
        if (!userData) {
            choices.push("Vous n'avez pas de template -> /ticket-setup")
        } else {
            choices = Object.keys(userData.data)
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		); 
    },
    async execute(interaction, client) {
        switch (interaction.options.getSubcommand()) {
            case "setup" : {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
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
                                                        if (i == 1 ) {
                                                            const placeHolder = interTemp2.fields.getTextInputValue("placeholder")
                                                            options.push({
                                                                name: name,
                                                                description: description,
                                                                placeHolder: placeHolder || null
                                                            });
                                                        } else {
                                                            options.push({
                                                                name: name,
                                                                description: description,
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
                                            await interactionNow.update({
                                                embeds: [
                                                    new EmbedBuilder()
                                                    .setColor("Blue")
                                                    .setTitle(`Définission des options ${i}/${inter3.values[0]}`)
                                                    .setFooter({text: "Vous avez 1m30 pour répondres"})
                                                    .setDescription("Définissez l'options avec le nom, une description, la couleur du bouton, l'émoji.")
                                                ],
                                                components: [
                                                    new ActionRowBuilder().addComponents(
                                                        new ButtonBuilder()
                                                        .setStyle(ButtonStyle.Success)
                                                        .setLabel(`Cliquez pour définir l'option N°${i}`)
                                                        .setCustomId("[no-check]")
                                                    )
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
                                                                .setCustomId("color")
                                                                .setLabel("Définissez la couleur du bouton")
                                                                .setPlaceholder("rouge | bleu | vert | gris")
                                                                .setStyle(TextInputStyle.Short)
                                                                .setMaxLength(90)
                                                                .setRequired(false)
                                                            )
                                                        )
                                                    
                                                    interTemp.showModal(ModalOption)
            
                                                    return interTemp.awaitModalSubmit({
                                                        filter: i => i.customId == "[no-check]ticket_define_choice",
                                                        time: 2 * 60 * 1000,
                                                    })
                                                    .then(interTemp2 => {
                                                        interactionNow = interTemp2
                                                        const name = interTemp2.fields.getTextInputValue("name")
                                                        const description = interTemp2.fields.getTextInputValue("description")
                                                        let color = interTemp2.fields.getTextInputValue("color")
                                                        switch (color.toLocaleUpperCase()) {
                                                            case "ROUGE" : {
                                                                color = ButtonStyle.Danger
                                                            }break
                                                            case "BLEU" : {
                                                                color = ButtonStyle.Primary
                                                            }break
                                                            case "VERT" : {
                                                                color = ButtonStyle.Success
                                                            }break
                                                            case "GRIS" : {
                                                                color = ButtonStyle.Secondary
                                                            }break
                                                            default: color = ButtonStyle.Primary
                                                        }
                                                        options.push({
                                                            name: name,
                                                            description: description,
                                                            color: color
                                                        });
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
                                        };
                                    };
                                    interactionNow.update({
                                        embeds: [
                                            new EmbedBuilder()
                                            .setTitle("Vous avez terminé la création de votre Ticket")
                                            .setDescription(`Vous pouvez Utiliser ce 'template' en utilisant la commande ${client.application.commands.cache.filter(i => i.name == "ticket-use").map(a => `</${a.name}:${a.id}>`)}`)
                                            .setColor("Green")
                                        ],
                                        components: []
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
                            interaction.deleteReply()
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
                        ).catch(reason => {
                            components.map(row => row.components.map(component => component.setDisabled(true)))
                            interaction.editReply({
                                components: components
                            });
                        })
                    })
                    .catch(err => client.error(err))
                }
            }break;
            case "use" : {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                    ],
                    ephemeral: true
                });
                
                const userData = client.managers.ticketsManager.getIfExist(interaction.user.id, {
                    userId: interaction.user.id,
                });
                if (!userData)return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("DarkPurple")
                        .setTitle("Vous n'avez pas de template de ticket")
                        .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "ticket-setup").map(a => `</${a.name}:${a.id}>`)} pour en créer`)
                    ],
                    ephemeral: true
                })
        
                const ticketsData = userData.data[interaction.options.getString("template")];
        
                let categorie = interaction.options.getChannel("catégorie")
                if (!categorie) {
                    await interaction.guild.channels.create({
                        type: ChannelType.GuildCategory,
                        name: "Ticket",
                        topic: "Catégorie créer automatiquement pour les tickets",
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: "ViewChannel"
                            }
                        ]
                    }).then(cate => {
                        categorie = cate
                    })
                }
        
                let rowTicket = new ActionRowBuilder()
                let selectMenuTicket = new StringSelectMenuBuilder()
                    .setCustomId(`ticketCreate#${categorie.id}`)
                    .setMaxValues(1)
                    .setPlaceholder(ticketsData[0].placeHolder || "aucun")
        
                let i = 0;
                for (let ticket of ticketsData) {
                    if (ticket.color) {
                        rowTicket.addComponents(
                            new ButtonBuilder()
                            .setCustomId(`ticketCreate#${categorie.id}#${i}`)
                            .setStyle(ticket.color)
                            .setLabel(ticket.name)
                        )
                    } else {
                        selectMenuTicket.addOptions({
                            label: `${ticket.name}`,
                            description: `${ticket.description}`,
                            value: `${ticket.name}`,
                        })
                    }
                    i++;
                }
        
                if (ticketsData[0].placeHolder) {
                    rowTicket.addComponents(selectMenuTicket)
                }
        
                interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({name: "Ouvrez votre ticket !", iconURL: interaction.client.user.avatarURL()})
                        .setDescription("Afin de créer un ticket, vous devez cliquer sur un des boutons/menu sélectif.\n\nLes différentes options possibles sont :")
                        .addFields(
                            ticketsData.map(data => {return{
                                name: data.name,
                                value: data.description,
                            }})
                        )
                        .setColor("Gold")
                        .setFooter({text: "Ticket"})
                    ],
                    components: [
                        rowTicket
                    ]
                });
        
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Le message de ticket à été envoyé avec succès !")
                        .setColor("Blurple")
                    ],
                    ephemeral: true
                })
            }break;
            case "delete" : {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                    ],
                    ephemeral: true
                });
        
                let userData = client.managers.ticketsManager.getIfExist(interaction.user.id);

                if (!userData || Object.keys(userData.data).length == 0)return interaction.reply({
                    embeds: [
                        new EmbedBuilder().setColor("Red").setDescription("Vous n'avez aucun template de ticket")
                    ], ephemeral: true
                })

                delete userData.data[interaction.options.getString("template")]
                userData.save();

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("Blurple")
                        .setDescription(`Vous avez supprimé avec succès la template "${interaction.options.getString("template")}"`)
                    ]
                })
            }break;
            case "list" : {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor('Red')
                        .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                    ],
                    ephemeral: true
                });
        
                const userData = client.managers.ticketsManager.getIfExist(interaction.user.id);
        
                let Embed = new EmbedBuilder().setColor("Green").setTitle(`Liste de vos ${Object.keys(userData.data).length} templates de ticket`);
                let Row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]Previous")
                    .setDisabled(true)
                    .setEmoji("◀️")
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId("[no-check]")
                    .setDisabled(true)
                    .setLabel(`1/${Math.ceil(Object.keys(userData.data).length/25)}`)
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId("[no-check]Next")
                    .setDisabled(false)
                    .setEmoji("▶️")
                    .setStyle(1),
                );
        
                for (const data of Object.keys(userData.data)) {
                    let i = Embed?.data.fields?.length || 0;
                    let k = 0;
                    Embed.addFields(
                        {
                            name: `ID: ${data}`,
                            value: `**Type:** ${userData.data[data][0].placeHolder ? "Menu Sélectif" : "Bouton"}\n**Option(s):**\n${userData.data[data].map(ticket => {k++; return `${k}. ${ticket.name}`}).join("\n")}`,
                            inline: true
                        }
                    )
                    if (i > 24)break;
                }
        
                if (Object.keys(userData.data).length <= 24) {
                    interaction.reply({
                        embeds: [
                            Embed
                        ],
                        ephemeral: true
                    })
                } else {
                    interaction.reply({
                        embeds: [
                            Embed
                        ],
                        components: [
                            Row
                        ],
                        ephemeral: true
                    }).then(msg => {
                        messageEdit(msg, interaction)
                    })
        
                    function messageEdit(msg, interaction) {
                        const collector = msg.createMessageComponentCollector({
                            time: 15*1000,
                            componentType: ComponentType.Button,
                            max: 1
                        })
                        collector.on('collect', inter => { 
                            const reponse = inter.customId.replace("[no-check]","")
                            const position = inter.message.components[0].components[1].label.split("/")
                            Embed.setFields()
                            switch (reponse) {
                                case "Previous" : {
                                    let i = (Number(position[0])-1)*25-1
                                    let j = (Number(position[0])-1)*25-25
                                    while (j <= i && j < Object.keys(userData.data).length) {
                                        let k = 0;
                                        Embed.addFields(
                                            {
                                                name: `ID: ${Object.keys(userData.data)[j]}`,
                                                value: `**Type:** ${userData.data[Object.keys(userData.data)[j]][0].placeHolder ? "Menu Sélectif" : "Bouton"}\n**Option(s):**\n${userData.data[Object.keys(userData.data)[j]].map(ticket => {k++; return `${k}. ${ticket.name}`}).join("\n")}`,
                                                inline: true
                                            }
                                        )
                                        j++;
                                    }
                                    if (Number(position[0])-1 == 1) {
                                        Row.components[0].setDisabled(true)
                                    }
                                    Row.components[2].setDisabled(false)
                                    Row.components[1].setLabel(`${Number(position[0])-1}/${position[1]}`)
                                    inter.update({
                                        embeds: [
                                            Embed
                                        ],
                                        components: [
                                            Row
                                        ]
                                    }).then(msg => {
                                        messageEdit(msg, interaction)
                                    })
                                }break;
                                case "Next" : {
                                    let i = Number(position[0])*25+24
                                    let j = Number(position[0])*25
                                    while (j <= i && j < Object.keys(userData.data).length) {
                                        let k = 0;
                                        Embed.addFields(
                                            {
                                                name: `ID: ${Object.keys(userData.data)[j]}`,
                                                value: `**Type:** ${userData.data[Object.keys(userData.data)[j]][0].placeHolder ? "Menu Sélectif" : "Bouton"}\n**Option(s):**\n${userData.data[Object.keys(userData.data)[j]].map(ticket => {k++; return `${k}. ${ticket.name}`}).join("\n")}`,
                                                inline: true
                                            }
                                        )
                                        j++;
                                    }
                                    if (Number(position[0])+1 == position[1]) {
                                        Row.components[2].setDisabled(true)
                                    }
                                    Row.components[0].setDisabled(false)
                                    Row.components[1].setLabel(`${Number(position[0])+1}/${position[1]}`)
                                    inter.update({
                                        embeds: [
                                            Embed
                                        ],
                                        components: [
                                            Row
                                        ]
                                    }).then(msg => {
                                        messageEdit(msg, interaction)
                                    })
                                }break;
                            }
                        });
                        collector.on("end", (coll,reason) => {
                            if (reason != "time")return
                            Row.components[0].setDisabled(true)
                            Row.components[2].setDisabled(true)
                            interaction.editReply({
                                components: [
                                    Row
                                ]
                            })
                        })
                    }
                }
            }break;
        }
    }
}