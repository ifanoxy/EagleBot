const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ModalBuilder, TextInputBuilder, StringSelectMenuBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("embed-create")
    .setDescription("Vous permet de créer un embed")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
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
                                        if (inter3.customId == "[no-check]embed_save") {
                                            client.fonctions.askWithModal(
                                                inter3,
                                                new ModalBuilder()
                                                .setTitle("Savegarde embed")
                                                .setCustomId("[no-check]embed_saving")
                                                .addComponents(
                                                    new ActionRowBuilder().addComponents(
                                                        new TextInputBuilder().setCustomId("name").setLabel("Donner un nom pour votre sauvegarde").setRequired(true).setMaxLength(30)
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
                                    inter2
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
                                                    new TextInputBuilder().setCustomId("name").setLabel("Donner un nom pour votre sauvegarde").setRequired(true).setMaxLength(30)
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
                                            memberData.embeds[FinalEmbed] = embed.toJSON();
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
                    });
                };
            })
        )
    }
}