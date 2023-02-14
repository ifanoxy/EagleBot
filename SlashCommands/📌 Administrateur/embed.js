const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextInputBuilder, ModalBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription("Vous permet de créer/supprimer/envoyer des embeds")
    .setDMPermission(false)
    .addSubcommand(
        sub => sub
        .setName("create")
        .setDescription("Vous permet de créer un embed")
    )
    .addSubcommand(
        sub => sub
        .setName("delete")
        .setDescription("Vous permet de supprimer un de vos embeds")
        .addStringOption(
            opt => opt.setName("embed").setDescription("l'embed que vous souhaitez supprimer").setRequired(true).setAutocomplete(true)
        )
    )
    .addSubcommand(
        sub => sub
        .setName("send")
        .setDescription("Vous permet d'envoyer un embed")
        .addStringOption(
            opt => opt.setName("embed").setDescription("L'embed que vous souhaitez envoyer").setRequired(true).setAutocomplete(true)
        )
    ),
    async autocomplete(interaction, client) {
        const userData = client.managers.membersManager.getIfExist(interaction.user.id, {
            memberId: interaction.user.id,
        });
        const focusedValue = interaction.options.getFocused();
		let choices = [];
        if (!userData || Object.keys(userData.embeds).length == 0) {
            choices.push("Vous n'avez pas créer d'embed --> /embed-create")
        } else {
            choices = Object.keys(userData.embeds)
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		); 
    },
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });

        switch (interaction.options.getSubcommand()) {
            case "create" : {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Créateur d'embed")
                        .setDescription(`
                        **Vous avez 2 possibilités de création d'embed :**
                        1. Rapide (environ 2 minutes de création)
                        2. Avancé (environ 5/10 minutes de création)
        
                        Vous pourrez ensuite envoyer cette embed et/ou le sauvegarder
                        pour le réutiliser pour tard !
                        `)
                        .setColor("Blue")
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                            .setCustomId("[no-check]embed_short")
                            .setLabel("Rapide")
                            .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                            .setCustomId("[no-check]embed_advanced")
                            .setLabel("Avancé")
                            .setStyle(ButtonStyle.Success)
                        )
                    ],
                    ephemeral: true
                })
                .then(msg => client.fonctions.askWithButton(
                        msg, 
                        [
                            new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                .setCustomId("[no-check]embed_short")
                                .setLabel("Rapide")
                                .setStyle(ButtonStyle.Primary),
                                new ButtonBuilder()
                                .setCustomId("[no-check]embed_advanced")
                                .setLabel("Avancé")
                                .setStyle(ButtonStyle.Success)
                            )
                        ],
                        interaction
                    )
                    .then(inter => {
                        const type = inter.customId.split("_")[1];
        
                        if (type == "short") {
                            inter.update({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle("Créateur d'embed | Rapide")
                                    .setDescription("Définissez les éléments principaux d'un embed: \n\nCouleur \nTitre\nDescription\nFooter")
                                    .setColor("#9283ab")
                                ], 
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                        .setStyle(ButtonStyle.Secondary)
                                        .setLabel("Ouvrir le modal")
                                        .setCustomId("[no-check]embed_openmodal")
                                    )
                                ],
                                ephemeral: true
                            })
                            .then(msg => client.fonctions.askWithButton(
                                    msg,
                                    [
                                        new ActionRowBuilder().addComponents(
                                            new ButtonBuilder()
                                            .setStyle(ButtonStyle.Secondary)
                                            .setLabel("Ouvrir le modal")
                                            .setCustomId("[no-check]embed_openmodal")
                                        )
                                    ],
                                    inter
                                )
                                .then(inter => client.fonctions.askWithModal(
                                        inter,
                                        new ModalBuilder()
                                        .setCustomId("[no-check]embed_fast")
                                        .setTitle("Créateur d'Embed | Rapide")
                                        .setComponents(
                                            new ActionRowBuilder().addComponents(
                                                new TextInputBuilder().setCustomId("title").setLabel("Titre de votre embed").setRequired(false).setStyle(1).setMaxLength(256)
                                            ),
                                            new ActionRowBuilder().addComponents(
                                                new TextInputBuilder().setCustomId("description").setLabel("Description de votre embed").setRequired(true).setStyle(2).setMaxLength(3500)
                                            ),
                                            new ActionRowBuilder().addComponents(
                                                new TextInputBuilder().setCustomId("color").setLabel("Couleur hexa de l'embed (ex: #9283ab)").setRequired(false).setStyle(1).setMaxLength(7)
                                            ),
                                            new ActionRowBuilder().addComponents(
                                                new TextInputBuilder().setCustomId("footer").setLabel("Footer de votre embed").setRequired(false).setStyle(1).setMaxLength(256)
                                            ),
                                        ),
                                        150,
                                        interaction
                                    )
                                    .then(inter2 => {
                                        const titre = inter2.fields.getTextInputValue('title');
                                        const description = inter2.fields.getTextInputValue('description');
                                        const color = inter2.fields.getTextInputValue('color');
                                        const footer = inter2.fields.getTextInputValue('footer');
                                        const embed = new EmbedBuilder()
                                            .setTitle(titre || null)
                                            .setDescription(description)
                                            .setColor(color.startsWith('#') ? color : "Random")
                                            .setFooter({text: footer || null})
                                        inter2.update({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setTitle("Vous avez terminé la création de votre embed !")
                                                .setColor("Yellow")
                                                .setDescription("Prévualisation en dessous."),
                                                embed
                                            ],
                                            components: [
                                                new ActionRowBuilder().addComponents(
                                                    new ButtonBuilder()
                                                    .setStyle(ButtonStyle.Success)
                                                    .setLabel("Envoyer dans ce channel")
                                                    .setCustomId("[no-check]embed_send"),
                                                    new ButtonBuilder()
                                                    .setCustomId("[no-check]embed_save")
                                                    .setStyle(ButtonStyle.Primary)
                                                    .setLabel("Sauvegarder l'embed.")
                                                )
                                            ]
                                        }).then(msg => {
                                            client.fonctions.askWithButton(
                                                msg,
                                                [
                                                    new ActionRowBuilder().addComponents(
                                                        new ButtonBuilder()
                                                        .setStyle(ButtonStyle.Success)
                                                        .setLabel("Envoyer dans ce channel")
                                                        .setCustomId("[no-check]embed_send"),
                                                        new ButtonBuilder()
                                                        .setCustomId("[no-check]embed_save")
                                                        .setStyle(ButtonStyle.Primary)
                                                        .setLabel("Sauvegarder l'embed.")
                                                    )
                                                ],
                                                inter2
                                            )
                                            .then(inter3 => {
                                                if(!inter3)return;
                                                if (inter3.customId == "[no-check]embed_save") {
                                                    client.fonctions.askWithModal(
                                                        inter3,
                                                        new ModalBuilder()
                                                        .setTitle("Savegarde embed")
                                                        .setCustomId("[no-check]embed_saving")
                                                        .addComponents(
                                                            new ActionRowBuilder().addComponents(
                                                                new TextInputBuilder().setStyle(1).setCustomId("name").setLabel("Donner un nom pour votre sauvegarde").setRequired(true).setMaxLength(30)
                                                            )
                                                        )
                                                    )
                                                    .then(inter4 => {
                                                        inter4.reply({
                                                            embeds: [
                                                                new EmbedBuilder()
                                                                .setTitle("Sauvegarde en cours de votre embed")
                                                                .setColor("Blurple")
                                                            ]
                                                        })
                                                        let memberData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, {
                                                            memberId: interaction.user.id
                                                        });
                                                        memberData.embeds[inter4.fields.getTextInputValue("name")] = embed.toJSON();
                                                        memberData.save();
                                                    });
                                                } else {
                                                    interaction.channel.send({
                                                        embeds: [embed]
                                                    }).then(() => {
                                                        inter3.reply({
                                                            embeds: [
                                                                new EmbedBuilder().setColor("Blurple")
                                                                .setDescription("L'embed a été envoyé avec succès !")
                                                            ],
                                                            ephemeral: true
                                                        })
                                                    })
                                                }
                                            });
                                        });
                                    })
                                )
                            );
                        } else {
                            const selectMenu = new ActionRowBuilder().addComponents(
                                new StringSelectMenuBuilder()
                                .setCustomId("[no-check]embed_advance")
                                .setMaxValues(9)
                                .setMinValues(1)
                                .setPlaceholder("Choisissez les éléments")
                                .setOptions(
                                    {
                                        label: "Auteur", value: "Author"
                                    },
                                    {
                                        label: "Titre", value: "Title"
                                    },
                                    {
                                        label: "Description", value: "Description"
                                    },
                                    {
                                        label: "Couleur", value: "Color"
                                    },
                                    {
                                        label: "Fields", value: "Fields"
                                    },
                                    {
                                        label: "Thumbnail", value: "Thumbnail"
                                    },
                                    {
                                        label: "Image", value: "Image"
                                    },
                                    {
                                        label: "Timestamp", value: "Timestamp"
                                    },
                                    {
                                        label: "Footer", value: "Footer"
                                    },
                                )
                            )
                            inter.update({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle("Créateur d'embed | Avancé")
                                    .setDescription("Définissez les éléments que vous souhaitez modifiers dans l'embed")
                                    .setColor("#9283ab")
                                ], 
                                components: [ selectMenu ],
                                ephemeral: true
                            })
                            .then(msg => {
                                client.fonctions.askWithSelectMenuString(msg, [selectMenu], interaction)
                                .then(async inter2 => {
                                    const choices = inter2.values;
                                    let interTemp = inter2;
                                    let FinalEmbed = new EmbedBuilder();
                                    for (let choice of choices) {
                                        const respond = await client.fonctions.embedCreator[`ask${choice}`](FinalEmbed, interTemp, interaction);
                                        interTemp = respond.interaction;
                                        FinalEmbed = respond.embed;
                                        if (!interTemp)break;
                                    };
                                    await interTemp.update({
                                        embeds: [
                                            new EmbedBuilder()
                                            .setTitle("Vous avez terminé la création de votre embed !")
                                            .setColor("Yellow")
                                            .setDescription("Prévualisation en dessous."),
                                            FinalEmbed
                                        ],
                                        components: [
                                            new ActionRowBuilder().addComponents(
                                                new ButtonBuilder()
                                                .setStyle(ButtonStyle.Success)
                                                .setLabel("Envoyer dans ce channel")
                                                .setCustomId("[no-check]embed_send"),
                                                new ButtonBuilder()
                                                .setCustomId("[no-check]embed_save")
                                                .setStyle(ButtonStyle.Primary)
                                                .setLabel("Sauvegarder l'embed.")
                                            )
                                        ]
                                    }).then(msg => {
                                        client.fonctions.askWithButton(
                                            msg,
                                            [
                                                new ActionRowBuilder().addComponents(
                                                    new ButtonBuilder()
                                                    .setStyle(ButtonStyle.Success)
                                                    .setLabel("Envoyer dans ce channel")
                                                    .setCustomId("[no-check]embed_send"),
                                                    new ButtonBuilder()
                                                    .setCustomId("[no-check]embed_save")
                                                    .setStyle(ButtonStyle.Primary)
                                                    .setLabel("Sauvegarder l'embed.")
                                                )
                                            ],
                                            interTemp
                                        )
                                        .then(inter3 => {
                                            if (inter3.customId == "[no-check]embed_save") {
                                                client.fonctions.askWithModal(
                                                    inter3,
                                                    new ModalBuilder()
                                                    .setTitle("Savegarde embed")
                                                    .setCustomId("[no-check]embed_saving")
                                                    .addComponents(
                                                        new ActionRowBuilder().addComponents(
                                                            new TextInputBuilder().setStyle(1).setCustomId("name").setLabel("Donner un nom pour votre sauvegarde").setRequired(true).setMaxLength(30)
                                                        )
                                                    )
                                                )
                                                .then(inter4 => {
                                                    inter4.reply({
                                                        embeds: [
                                                            new EmbedBuilder()
                                                            .setTitle("Embed sauvegardé avec succès !")
                                                            .setColor("Blurple")
                                                        ],
                                                        ephemeral: true
                                                    })
                                                    let memberData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, {
                                                        memberId: interaction.user.id
                                                    });
                                                    memberData.embeds[inter4.fields.getTextInputValue("name")] = FinalEmbed.toJSON();
                                                    memberData.save();
                                                });
                                            } else {
                                                interaction.channel.send({
                                                    embeds: [FinalEmbed]
                                                }).then(() => {
                                                    inter3.reply({
                                                        embeds: [
                                                            new EmbedBuilder().setColor("Blurple")
                                                            .setDescription("L'embed a été envoyé avec succès !")
                                                        ],
                                                        ephemeral: true
                                                    })
                                                })
                                            }
                                        });
                                    });
                                })
                            });
                        };
                    })
                )
            }break;
            case "delete" : {
                let userData = client.managers.membersManager.getIfExist(interaction.user.id, {
                    userId: interaction.user.id,
                });
                if (!userData || Object.keys(userData.embeds).length == 0)return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("DarkPurple")
                        .setTitle("Vous n'avez pas d'embed créé")
                        .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "embed").map(a => `</${a.name} create:${a.id}>`)} pour en créer`)
                    ],
                    ephemeral: true
                });
        
                userData.embeds[interaction.options.getString('embed')].delete();
        
                userData.save()
        
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle("Vous avez supprimé avec succès l'embed"+ interaction.options.getString('embed'))
                        .setColor("Aqua")
                    ],
                    ephemeral: true
                })
            }break;
            case "send" : {
                const userData = client.managers.membersManager.getIfExist(interaction.user.id, {
                    userId: interaction.user.id,
                });
                if (!userData || Object.keys(userData.embeds).length == 0)return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("DarkPurple")
                        .setTitle("Vous n'avez pas d'embed créé")
                        .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "embed").map(a => `</${a.name} create:${a.id}>`)} pour en créer`)
                    ],
                    ephemeral: true
                });
        
                const embedData = userData.embeds[interaction.options.getString('embed')];
                
                interaction.channel.send({
                    embeds: [
                        embedData
                    ]
                }).then(() => {
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder().setTitle("L'embed a été envoyé avec succès !").setColor("Blurple")
                        ],
                        ephemeral: true
                    })
                })
            }break;
        }
    }
}