import {
    ActionRowBuilder,
    AutocompleteInteraction,
    ButtonBuilder, ButtonStyle,
    ChatInputCommandInteraction, EmbedBuilder, ModalBuilder,
    SlashCommandBuilder, StringSelectMenuBuilder, TextInputBuilder
} from "discord.js";
import {EagleClient} from "../../../structures/Client";

export default {
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
        )
        .addSubcommand(
            sub => sub
                .setName("edit")
                .setDescription("Vous permet de modifier un embed")
                .addStringOption(
                    opt => opt.setName("embed").setDescription("L'embed que vous souhaitez modifier").setRequired(true).setAutocomplete(true)
                )
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        const userData = client.managers.membersManager.getIfExist(interaction.user.id);
        const focusedValue = interaction.options.getFocused();
        let choices = [];
        if (!userData || Object.keys(userData.embeds).length == 0) {
            choices.push("Vous n'avez pas créer d'embed --> /embed-create")
        } else {
            choices = Object.keys(userData.embeds)
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue)).slice(0, 25);
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
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
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
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
                    ephemeral: true,
                    fetchReply: true
                })
                    .then(msg => client.func.utils.askWithButton(msg)
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
                                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                                            new ButtonBuilder()
                                                .setStyle(ButtonStyle.Secondary)
                                                .setLabel("Ouvrir le modal")
                                                .setCustomId("[no-check]embed_openmodal")
                                        )
                                    ],
                                    fetchReply: true
                                })
                                    .then(msg => client.func.utils.askWithButton(msg)
                                            .then(inter => client.func.utils.askWithModal(
                                                    inter,
                                                    new ModalBuilder()
                                                        .setCustomId("[no-check]embed_fast")
                                                        .setTitle("Créateur d'Embed | Rapide")
                                                        .setComponents(
                                                            new ActionRowBuilder<TextInputBuilder>().addComponents(
                                                                new TextInputBuilder().setCustomId("title").setLabel("Titre de votre embed").setRequired(false).setStyle(1).setMaxLength(256)
                                                            ),
                                                            new ActionRowBuilder<TextInputBuilder>().addComponents(
                                                                new TextInputBuilder().setCustomId("description").setLabel("Description de votre embed").setRequired(true).setStyle(2).setMaxLength(3500)
                                                            ),
                                                            new ActionRowBuilder<TextInputBuilder>().addComponents(
                                                                new TextInputBuilder().setCustomId("color").setLabel("Couleur hexa de l'embed (ex: #9283ab)").setRequired(false).setStyle(1).setMaxLength(7)
                                                            ),
                                                            new ActionRowBuilder<TextInputBuilder>().addComponents(
                                                                new TextInputBuilder().setCustomId("footer").setLabel("Footer de votre embed").setRequired(false).setStyle(1).setMaxLength(256)
                                                            ),
                                                        ),
                                                    150
                                                )
                                                    .then(inter2 => {
                                                        const titre = inter2.fields.getTextInputValue('title');
                                                        const description = inter2.fields.getTextInputValue('description');
                                                        const color = inter2.fields.getTextInputValue('color');
                                                        const footer = inter2.fields.getTextInputValue('footer');
                                                        const embed = new EmbedBuilder()
                                                            .setTitle(titre || null)
                                                            .setDescription(description)
                                                            // @ts-ignore
                                                            .setColor((color.startsWith('#') ? color : "Random") || "Random")
                                                            .setFooter({text: footer || null})
                                                        inter2.message.edit({
                                                            embeds: [
                                                                new EmbedBuilder()
                                                                    .setTitle("Vous avez terminé la création de votre embed !")
                                                                    .setColor("Yellow")
                                                                    .setDescription("Prévualisation en dessous."),
                                                                embed
                                                            ],
                                                            components: [
                                                                new ActionRowBuilder<ButtonBuilder>().addComponents(
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
                                                            client.func.utils.askWithButton(msg)
                                                                .then(inter3 => {
                                                                    if(!inter3)return;
                                                                    if (inter3.customId == "[no-check]embed_save") {
                                                                        client.func.utils.askWithModal(
                                                                            inter3,
                                                                            new ModalBuilder()
                                                                                .setTitle("Savegarde embed")
                                                                                .setCustomId("[no-check]embed_saving")
                                                                                .addComponents(
                                                                                    new ActionRowBuilder<TextInputBuilder>().addComponents(
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
                                                                                    ],
                                                                                    fetchReply: true
                                                                                })
                                                                                let memberData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, {
                                                                                    memberId: interaction.user.id
                                                                                });
                                                                                memberData.embeds[inter4.fields.getTextInputValue("name")] = embed.toJSON();
                                                                                memberData.save();
                                                                            });
                                                                    } else {
                                                                        // @ts-ignore
                                                                        interaction.channel.send({
                                                                            embeds: [embed]
                                                                        }).then(() => {
                                                                            inter3.reply({
                                                                                embeds: [
                                                                                    new EmbedBuilder().setColor("Blurple")
                                                                                        .setDescription("L'embed a été envoyé avec succès !")
                                                                                ],
                                                                                ephemeral: true,
                                                                                fetchReply: true
                                                                            })
                                                                        })
                                                                    }
                                                                });
                                                        });
                                                    })
                                            )
                                    );
                            } else {
                                const selectMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
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
                                    fetchReply: true
                                })
                                    .then(msg => {
                                        client.func.utils.askWithSelectMenuString(msg)
                                            .then(async inter2 => {
                                                const choices = inter2.values;
                                                let interTemp = inter2;
                                                let FinalEmbed = new EmbedBuilder();
                                                for (let choice of choices) {
                                                    const respond = await client.func.embedCreator[`ask${choice}`](FinalEmbed, interTemp);
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
                                                    ],
                                                    fetchReply: true
                                                }).then(msg => {
                                                    client.func.utils.askWithButton(msg)
                                                        .then(inter3 => {
                                                            if (inter3.customId == "[no-check]embed_save") {
                                                                client.func.utils.askWithModal(
                                                                    inter3,
                                                                    new ModalBuilder()
                                                                        .setTitle("Savegarde embed")
                                                                        .setCustomId("[no-check]embed_saving")
                                                                        .addComponents(
                                                                            new ActionRowBuilder<TextInputBuilder>().addComponents(
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
                                                                            ephemeral: true,
                                                                            fetchReply: true
                                                                        })
                                                                        let memberData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, {
                                                                            memberId: interaction.user.id
                                                                        });
                                                                        memberData.embeds[inter4.fields.getTextInputValue("name")] = FinalEmbed.toJSON();
                                                                        memberData.save();
                                                                    });
                                                            } else {
                                                                // @ts-ignore
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
                let userData = client.managers.membersManager.getIfExist(interaction.user.id);
                if (!userData || Object.keys(userData.embeds).length == 0)return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("DarkPurple")
                            .setTitle("Vous n'avez pas d'embed créé")
                            .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "embed").map(a => `</${a.name} create:${a.id}>`)} pour en créer`)
                    ],
                    ephemeral: true
                });

                delete userData.embeds[interaction.options.getString('embed')];

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
                const userData = client.managers.membersManager.getIfExist(interaction.user.id);
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

                // @ts-ignore
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
            case "edit" : {
                const userData = client.managers.membersManager.getIfExist(interaction.user.id);
                if (!userData || Object.keys(userData.embeds).length == 0)return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("DarkPurple")
                            .setTitle("Vous n'avez pas d'embed créé")
                            .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "embed").map(a => `</${a.name} create:${a.id}>`)} pour en créer`)
                    ],
                    ephemeral: true
                });

                let embedData = userData.embeds[interaction.options.getString('embed')];

                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Yellow")
                            .setDescription(`Voici l'embed \`${interaction.options.getString('embed')}\` que vous pouvez editer.`),
                        embedData
                    ],
                    components: createRows(),
                    fetchReply: true
                }).then(msg => mainEdit(msg))

                function mainEdit(msg) {
                    client.func.utils.askWithButton(msg, 60)
                        .then(async inter => {
                            if (!inter)return;
                            const choice = inter.customId.split("#")[1];
                            if (choice.split("_").length == 1) {
                                if (choice == "save") {
                                    userData.embeds[interaction.options.getString('embed')] = embedData;
                                    await userData.save();
                                    // @ts-ignore
                                    inter.message.components.map(row => row.components.map(btn => btn.data.disabled = true));
                                    inter.update({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Green")
                                                .setDescription(`Fin de l'édition de l'embed \`${interaction.options.getString('embed')}\`.`),
                                            embedData
                                        ],
                                        components: inter.message.components,
                                    })
                                } else {
                                    const res = await client.func.embedCreator[`ask${choice}`](new EmbedBuilder(embedData), inter);
                                    embedData = res.embed.data;

                                    res.interaction.update({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Yellow")
                                                .setDescription(`Voici l'embed \`${interaction.options.getString('embed')}\` que vous pouvez editer.`),
                                            embedData
                                        ],
                                        components: createRows(),
                                        fetchReply: true
                                    }).then(msg => mainEdit(msg))
                                }
                            } else {
                                if (choice.split("_")[1] == "add") {
                                    let rows = createRows();
                                    rows[choice.split("_")[2][0]].components[choice.split("_")[2][2]].setDisabled(false)
                                    inter.update({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Yellow")
                                                .setDescription(`Voici l'embed \`${interaction.options.getString('embed')}\` que vous pouvez editer.`),
                                            embedData
                                        ],
                                        components: rows,
                                        fetchReply: true
                                    }).then(msg => mainEdit(msg))
                                } else {
                                    embedData[choice.split("_")[0].toLowerCase()] = null;
                                    userData.save();
                                    inter.update({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor("Yellow")
                                                .setDescription(`Voici l'embed \`${interaction.options.getString('embed')}\` que vous pouvez editer.`),
                                            embedData
                                        ],
                                        components: createRows(),
                                        fetchReply: true
                                    }).then(msg => mainEdit(msg))
                                }
                            }

                        })
                }

                function createRows() {
                    return [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder().setLabel("Auteur").setCustomId("[no-check]embedEdit#Author").setStyle(ButtonStyle.Primary).setDisabled(!embedData.author),
                            new ButtonBuilder().setEmoji(embedData.author ? "✅" : "⛔").setStyle(embedData.author ? ButtonStyle.Success : ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Author_" + (embedData.author ? "remove" : "add") + "_0/0"),
                            new ButtonBuilder().setDisabled(true).setStyle(ButtonStyle.Secondary).setLabel("‎").setCustomId("[no-check]embedEdit#1"),
                            new ButtonBuilder().setLabel("Description").setCustomId("[no-check]embedEdit#Description").setStyle(ButtonStyle.Primary).setDisabled(!embedData.description),
                            new ButtonBuilder().setEmoji(embedData.description ? "✅" : "⛔").setStyle(embedData.description ? ButtonStyle.Success : ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Description_" + (embedData.description ? "remove" : "add" + "_0/3")),
                            ),
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder().setLabel("Titre").setCustomId("[no-check]embedEdit#Title").setStyle(ButtonStyle.Primary).setDisabled(!embedData.title),
                            new ButtonBuilder().setEmoji(embedData.title ? "✅" : "⛔").setStyle(embedData.title ? ButtonStyle.Success : ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Title_" + (embedData.title ? "remove" : "add") + "_1/0"),
                            new ButtonBuilder().setDisabled(true).setStyle(ButtonStyle.Secondary).setLabel("‎").setCustomId("[no-check]embedEdit#2"),
                            new ButtonBuilder().setLabel("Couleur").setCustomId("[no-check]embedEdit#Color").setStyle(ButtonStyle.Primary).setDisabled(!embedData.color),
                            new ButtonBuilder().setEmoji(embedData.color ? "✅" : "⛔").setStyle(embedData.color ? ButtonStyle.Success : ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Color_" + (embedData.color ? "remove" : "add") + "_1/3"),
                        ),
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder().setLabel("Fields").setCustomId("[no-check]embedEdit#Fields").setStyle(ButtonStyle.Primary).setDisabled(!embedData.fields),
                            new ButtonBuilder().setEmoji(embedData.fields ? "✅" : "⛔").setStyle(embedData.fields ? ButtonStyle.Success : ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Fields_" + (embedData.fields ? "remove" : "add") + "_2/0"),
                            new ButtonBuilder().setDisabled(true).setStyle(ButtonStyle.Secondary).setLabel("‎").setCustomId("[no-check]embedEdit#3"),
                            new ButtonBuilder().setLabel("Thumbnail").setCustomId("[no-check]embedEdit#Thumbnail").setStyle(ButtonStyle.Primary).setDisabled(!embedData.thumbnail),
                            new ButtonBuilder().setEmoji(embedData.thumbnail ? "✅" : "⛔").setStyle(embedData.thumbnail ? ButtonStyle.Success : ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Thumbnail_" + (embedData.thumbnail ? "remove" : "add") + "_2/3"),
                        ),
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder().setLabel("Image").setCustomId("[no-check]embedEdit#Image").setStyle(ButtonStyle.Primary).setDisabled(!embedData.image),
                            new ButtonBuilder().setEmoji(embedData.image ? "✅" : "⛔").setStyle(embedData.image ? ButtonStyle.Success : ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Image_" + (embedData.image ? "remove" : "add") + "_3/0"),
                            new ButtonBuilder().setDisabled(true).setStyle(ButtonStyle.Secondary).setLabel("‎").setCustomId("[no-check]embedEdit#4"),
                            new ButtonBuilder().setLabel("Timestamp").setCustomId("[no-check]embedEdit#Timestamp").setStyle(ButtonStyle.Primary).setDisabled(!embedData.timestamp),
                            new ButtonBuilder().setEmoji(embedData.timestamp ? "✅" : "⛔").setStyle(embedData.timestamp ? ButtonStyle.Success : ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Timestamp_" + (embedData.timestamp ? "remove" : "add") + "_3/3"),
                        ),
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder().setLabel("Footer").setCustomId("[no-check]embedEdit#Footer").setStyle(ButtonStyle.Primary).setDisabled(!embedData.footer),
                            new ButtonBuilder().setEmoji(embedData.footer ? "✅" : "⛔").setStyle(embedData.footer ? ButtonStyle.Success : ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Footer_" + (embedData.footer ? "remove" : "add") + "_4/0"),
                            new ButtonBuilder().setDisabled(true).setStyle(ButtonStyle.Secondary).setLabel("‎").setCustomId("[no-check]embedEdit#5"),
                            new ButtonBuilder().setStyle(ButtonStyle.Success).setLabel("Sauvegarder").setEmoji("♻️").setCustomId("[no-check]embedEdit#save")
                        ),
                    ]
                };
            }
        }
    }
}