"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('embed')
        .setDescription("Vous permet de créer/supprimer/envoyer des embeds")
        .setDMPermission(false)
        .addSubcommand(sub => sub
        .setName("create")
        .setDescription("Vous permet de créer un embed"))
        .addSubcommand(sub => sub
        .setName("delete")
        .setDescription("Vous permet de supprimer un de vos embeds")
        .addStringOption(opt => opt.setName("embed").setDescription("l'embed que vous souhaitez supprimer").setRequired(true).setAutocomplete(true)))
        .addSubcommand(sub => sub
        .setName("send")
        .setDescription("Vous permet d'envoyer un embed")
        .addStringOption(opt => opt.setName("embed").setDescription("L'embed que vous souhaitez envoyer").setRequired(true).setAutocomplete(true)))
        .addSubcommand(sub => sub
        .setName("edit")
        .setDescription("Vous permet de modifier un embed")
        .addStringOption(opt => opt.setName("embed").setDescription("L'embed que vous souhaitez modifier").setRequired(true).setAutocomplete(true))),
    autocomplete(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = client.managers.membersManager.getIfExist(interaction.user.id);
            const focusedValue = interaction.options.getFocused();
            let choices = [];
            if (!userData || Object.keys(userData.embeds).length == 0) {
                choices.push("Vous n'avez pas créer d'embed --> /embed-create");
            }
            else {
                choices = Object.keys(userData.embeds);
            }
            const filtered = choices.filter(choice => choice.startsWith(focusedValue)).slice(0, 25);
            yield interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
        });
    },
    execute(interaction, client) {
        switch (interaction.options.getSubcommand()) {
            case "create":
                {
                    interaction.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
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
                            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                .setCustomId("[no-check]embed_short")
                                .setLabel("Rapide")
                                .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
                                .setCustomId("[no-check]embed_advanced")
                                .setLabel("Avancé")
                                .setStyle(discord_js_1.ButtonStyle.Success))
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
                                    new discord_js_1.EmbedBuilder()
                                        .setTitle("Créateur d'embed | Rapide")
                                        .setDescription("Définissez les éléments principaux d'un embed: \n\nCouleur \nTitre\nDescription\nFooter")
                                        .setColor("#9283ab")
                                ],
                                components: [
                                    new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                        .setStyle(discord_js_1.ButtonStyle.Secondary)
                                        .setLabel("Ouvrir le modal")
                                        .setCustomId("[no-check]embed_openmodal"))
                                ],
                                fetchReply: true
                            })
                                .then(msg => client.func.utils.askWithButton(msg)
                                .then(inter => client.func.utils.askWithModal(inter, new discord_js_1.ModalBuilder()
                                .setCustomId("[no-check]embed_fast")
                                .setTitle("Créateur d'Embed | Rapide")
                                .setComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("title").setLabel("Titre de votre embed").setRequired(false).setStyle(1).setMaxLength(256)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("description").setLabel("Description de votre embed").setRequired(true).setStyle(2).setMaxLength(3500)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("color").setLabel("Couleur hexa de l'embed (ex: #9283ab)").setRequired(false).setStyle(1).setMaxLength(7)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("footer").setLabel("Footer de votre embed").setRequired(false).setStyle(1).setMaxLength(256))), 150)
                                .then(inter2 => {
                                const titre = inter2.fields.getTextInputValue('title');
                                const description = inter2.fields.getTextInputValue('description');
                                const color = inter2.fields.getTextInputValue('color');
                                const footer = inter2.fields.getTextInputValue('footer');
                                const embed = new discord_js_1.EmbedBuilder()
                                    .setTitle(titre || null)
                                    .setDescription(description)
                                    // @ts-ignore
                                    .setColor((color.startsWith('#') ? color : "Random") || "Random")
                                    .setFooter({ text: footer || null });
                                inter2.message.edit({
                                    embeds: [
                                        new discord_js_1.EmbedBuilder()
                                            .setTitle("Vous avez terminé la création de votre embed !")
                                            .setColor("Yellow")
                                            .setDescription("Prévualisation en dessous."),
                                        embed
                                    ],
                                    components: [
                                        new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                            .setStyle(discord_js_1.ButtonStyle.Success)
                                            .setLabel("Envoyer dans ce channel")
                                            .setCustomId("[no-check]embed_send"), new discord_js_1.ButtonBuilder()
                                            .setCustomId("[no-check]embed_save")
                                            .setStyle(discord_js_1.ButtonStyle.Primary)
                                            .setLabel("Sauvegarder l'embed."))
                                    ]
                                }).then(msg => {
                                    client.func.utils.askWithButton(msg)
                                        .then(inter3 => {
                                        if (!inter3)
                                            return;
                                        if (inter3.customId == "[no-check]embed_save") {
                                            client.func.utils.askWithModal(inter3, new discord_js_1.ModalBuilder()
                                                .setTitle("Savegarde embed")
                                                .setCustomId("[no-check]embed_saving")
                                                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setStyle(1).setCustomId("name").setLabel("Donner un nom pour votre sauvegarde").setRequired(true).setMaxLength(30))))
                                                .then(inter4 => {
                                                inter4.reply({
                                                    embeds: [
                                                        new discord_js_1.EmbedBuilder()
                                                            .setTitle("Sauvegarde en cours de votre embed")
                                                            .setColor("Blurple")
                                                    ],
                                                    fetchReply: true
                                                });
                                                let memberData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, {
                                                    memberId: interaction.user.id
                                                });
                                                memberData.embeds[inter4.fields.getTextInputValue("name")] = embed.toJSON();
                                                memberData.save();
                                            });
                                        }
                                        else {
                                            // @ts-ignore
                                            interaction.channel.send({
                                                embeds: [embed]
                                            }).then(() => {
                                                inter3.reply({
                                                    embeds: [
                                                        new discord_js_1.EmbedBuilder().setColor("Blurple")
                                                            .setDescription("L'embed a été envoyé avec succès !")
                                                    ],
                                                    ephemeral: true,
                                                    fetchReply: true
                                                });
                                            });
                                        }
                                    });
                                });
                            })));
                        }
                        else {
                            const selectMenu = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
                                .setCustomId("[no-check]embed_advance")
                                .setMaxValues(9)
                                .setMinValues(1)
                                .setPlaceholder("Choisissez les éléments")
                                .setOptions({
                                label: "Auteur", value: "Author"
                            }, {
                                label: "Titre", value: "Title"
                            }, {
                                label: "Description", value: "Description"
                            }, {
                                label: "Couleur", value: "Color"
                            }, {
                                label: "Fields", value: "Fields"
                            }, {
                                label: "Thumbnail", value: "Thumbnail"
                            }, {
                                label: "Image", value: "Image"
                            }, {
                                label: "Timestamp", value: "Timestamp"
                            }, {
                                label: "Footer", value: "Footer"
                            }));
                            inter.update({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setTitle("Créateur d'embed | Avancé")
                                        .setDescription("Définissez les éléments que vous souhaitez modifiers dans l'embed")
                                        .setColor("#9283ab")
                                ],
                                components: [selectMenu],
                                fetchReply: true
                            })
                                .then(msg => {
                                client.func.utils.askWithSelectMenuString(msg)
                                    .then((inter2) => __awaiter(this, void 0, void 0, function* () {
                                    const choices = inter2.values;
                                    let interTemp = inter2;
                                    let FinalEmbed = new discord_js_1.EmbedBuilder();
                                    for (let choice of choices) {
                                        const respond = yield client.func.embedCreator[`ask${choice}`](FinalEmbed, interTemp);
                                        interTemp = respond.interaction;
                                        FinalEmbed = respond.embed;
                                        if (!interTemp)
                                            break;
                                    }
                                    ;
                                    yield interTemp.update({
                                        embeds: [
                                            new discord_js_1.EmbedBuilder()
                                                .setTitle("Vous avez terminé la création de votre embed !")
                                                .setColor("Yellow")
                                                .setDescription("Prévualisation en dessous."),
                                            FinalEmbed
                                        ],
                                        components: [
                                            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                                .setStyle(discord_js_1.ButtonStyle.Success)
                                                .setLabel("Envoyer dans ce channel")
                                                .setCustomId("[no-check]embed_send"), new discord_js_1.ButtonBuilder()
                                                .setCustomId("[no-check]embed_save")
                                                .setStyle(discord_js_1.ButtonStyle.Primary)
                                                .setLabel("Sauvegarder l'embed."))
                                        ],
                                        fetchReply: true
                                    }).then(msg => {
                                        client.func.utils.askWithButton(msg)
                                            .then(inter3 => {
                                            if (inter3.customId == "[no-check]embed_save") {
                                                client.func.utils.askWithModal(inter3, new discord_js_1.ModalBuilder()
                                                    .setTitle("Savegarde embed")
                                                    .setCustomId("[no-check]embed_saving")
                                                    .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setStyle(1).setCustomId("name").setLabel("Donner un nom pour votre sauvegarde").setRequired(true).setMaxLength(30))))
                                                    .then(inter4 => {
                                                    inter4.reply({
                                                        embeds: [
                                                            new discord_js_1.EmbedBuilder()
                                                                .setTitle("Embed sauvegardé avec succès !")
                                                                .setColor("Blurple")
                                                        ],
                                                        ephemeral: true,
                                                        fetchReply: true
                                                    });
                                                    let memberData = client.managers.membersManager.getAndCreateIfNotExists(interaction.user.id, {
                                                        memberId: interaction.user.id
                                                    });
                                                    memberData.embeds[inter4.fields.getTextInputValue("name")] = FinalEmbed.toJSON();
                                                    memberData.save();
                                                });
                                            }
                                            else {
                                                // @ts-ignore
                                                interaction.channel.send({
                                                    embeds: [FinalEmbed]
                                                }).then(() => {
                                                    inter3.reply({
                                                        embeds: [
                                                            new discord_js_1.EmbedBuilder().setColor("Blurple")
                                                                .setDescription("L'embed a été envoyé avec succès !")
                                                        ],
                                                        ephemeral: true
                                                    });
                                                });
                                            }
                                        });
                                    });
                                }));
                            });
                        }
                        ;
                    }));
                }
                break;
            case "delete":
                {
                    let userData = client.managers.membersManager.getIfExist(interaction.user.id);
                    if (!userData || Object.keys(userData.embeds).length == 0)
                        return interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor("DarkPurple")
                                    .setTitle("Vous n'avez pas d'embed créé")
                                    .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "embed").map(a => `</${a.name} create:${a.id}>`)} pour en créer`)
                            ],
                            ephemeral: true
                        });
                    delete userData.embeds[interaction.options.getString('embed')];
                    userData.save();
                    interaction.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setTitle("Vous avez supprimé avec succès l'embed" + interaction.options.getString('embed'))
                                .setColor("Aqua")
                        ],
                        ephemeral: true
                    });
                }
                break;
            case "send":
                {
                    const userData = client.managers.membersManager.getIfExist(interaction.user.id);
                    if (!userData || Object.keys(userData.embeds).length == 0)
                        return interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
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
                                new discord_js_1.EmbedBuilder().setTitle("L'embed a été envoyé avec succès !").setColor("Blurple")
                            ],
                            ephemeral: true
                        });
                    });
                }
                break;
            case "edit": {
                const userData = client.managers.membersManager.getIfExist(interaction.user.id);
                if (!userData || Object.keys(userData.embeds).length == 0)
                    return interaction.reply({
                        embeds: [
                            new discord_js_1.EmbedBuilder()
                                .setColor("DarkPurple")
                                .setTitle("Vous n'avez pas d'embed créé")
                                .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "embed").map(a => `</${a.name} create:${a.id}>`)} pour en créer`)
                        ],
                        ephemeral: true
                    });
                let embedData = userData.embeds[interaction.options.getString('embed')];
                interaction.reply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setColor("Yellow")
                            .setDescription(`Voici l'embed \`${interaction.options.getString('embed')}\` que vous pouvez editer.`),
                        embedData
                    ],
                    components: createRows(),
                    fetchReply: true
                }).then(msg => mainEdit(msg));
                function mainEdit(msg) {
                    client.func.utils.askWithButton(msg, 60)
                        .then((inter) => __awaiter(this, void 0, void 0, function* () {
                        if (!inter)
                            return;
                        const choice = inter.customId.split("#")[1];
                        if (choice.split("_").length == 1) {
                            if (choice == "save") {
                                userData.embeds[interaction.options.getString('embed')] = embedData;
                                yield userData.save();
                                // @ts-ignore
                                inter.message.components.map(row => row.components.map(btn => btn.data.disabled = true));
                                inter.update({
                                    embeds: [
                                        new discord_js_1.EmbedBuilder()
                                            .setColor("Green")
                                            .setDescription(`Fin de l'édition de l'embed \`${interaction.options.getString('embed')}\`.`),
                                        embedData
                                    ],
                                    components: inter.message.components,
                                });
                            }
                            else {
                                const res = yield client.func.embedCreator[`ask${choice}`](new discord_js_1.EmbedBuilder(embedData), inter);
                                embedData = res.embed.data;
                                res.interaction.update({
                                    embeds: [
                                        new discord_js_1.EmbedBuilder()
                                            .setColor("Yellow")
                                            .setDescription(`Voici l'embed \`${interaction.options.getString('embed')}\` que vous pouvez editer.`),
                                        embedData
                                    ],
                                    components: createRows(),
                                    fetchReply: true
                                }).then(msg => mainEdit(msg));
                            }
                        }
                        else {
                            if (choice.split("_")[1] == "add") {
                                let rows = createRows();
                                rows[choice.split("_")[2][0]].components[choice.split("_")[2][2]].setDisabled(false);
                                inter.update({
                                    embeds: [
                                        new discord_js_1.EmbedBuilder()
                                            .setColor("Yellow")
                                            .setDescription(`Voici l'embed \`${interaction.options.getString('embed')}\` que vous pouvez editer.`),
                                        embedData
                                    ],
                                    components: rows,
                                    fetchReply: true
                                }).then(msg => mainEdit(msg));
                            }
                            else {
                                embedData[choice.split("_")[0].toLowerCase()] = null;
                                userData.save();
                                inter.update({
                                    embeds: [
                                        new discord_js_1.EmbedBuilder()
                                            .setColor("Yellow")
                                            .setDescription(`Voici l'embed \`${interaction.options.getString('embed')}\` que vous pouvez editer.`),
                                        embedData
                                    ],
                                    components: createRows(),
                                    fetchReply: true
                                }).then(msg => mainEdit(msg));
                            }
                        }
                    }));
                }
                function createRows() {
                    return [
                        new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setLabel("Auteur").setCustomId("[no-check]embedEdit#Author").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(!embedData.author), new discord_js_1.ButtonBuilder().setEmoji(embedData.author ? "✅" : "⛔").setStyle(embedData.author ? discord_js_1.ButtonStyle.Success : discord_js_1.ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Author_" + (embedData.author ? "remove" : "add") + "_0/0"), new discord_js_1.ButtonBuilder().setDisabled(true).setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("‎").setCustomId("[no-check]embedEdit#1"), new discord_js_1.ButtonBuilder().setLabel("Description").setCustomId("[no-check]embedEdit#Description").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(!embedData.description), new discord_js_1.ButtonBuilder().setEmoji(embedData.description ? "✅" : "⛔").setStyle(embedData.description ? discord_js_1.ButtonStyle.Success : discord_js_1.ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Description_" + (embedData.description ? "remove" : "add" + "_0/3"))),
                        new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setLabel("Titre").setCustomId("[no-check]embedEdit#Title").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(!embedData.title), new discord_js_1.ButtonBuilder().setEmoji(embedData.title ? "✅" : "⛔").setStyle(embedData.title ? discord_js_1.ButtonStyle.Success : discord_js_1.ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Title_" + (embedData.title ? "remove" : "add") + "_1/0"), new discord_js_1.ButtonBuilder().setDisabled(true).setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("‎").setCustomId("[no-check]embedEdit#2"), new discord_js_1.ButtonBuilder().setLabel("Couleur").setCustomId("[no-check]embedEdit#Color").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(!embedData.color), new discord_js_1.ButtonBuilder().setEmoji(embedData.color ? "✅" : "⛔").setStyle(embedData.color ? discord_js_1.ButtonStyle.Success : discord_js_1.ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Color_" + (embedData.color ? "remove" : "add") + "_1/3")),
                        new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setLabel("Fields").setCustomId("[no-check]embedEdit#Fields").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(!embedData.fields), new discord_js_1.ButtonBuilder().setEmoji(embedData.fields ? "✅" : "⛔").setStyle(embedData.fields ? discord_js_1.ButtonStyle.Success : discord_js_1.ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Fields_" + (embedData.fields ? "remove" : "add") + "_2/0"), new discord_js_1.ButtonBuilder().setDisabled(true).setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("‎").setCustomId("[no-check]embedEdit#3"), new discord_js_1.ButtonBuilder().setLabel("Thumbnail").setCustomId("[no-check]embedEdit#Thumbnail").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(!embedData.thumbnail), new discord_js_1.ButtonBuilder().setEmoji(embedData.thumbnail ? "✅" : "⛔").setStyle(embedData.thumbnail ? discord_js_1.ButtonStyle.Success : discord_js_1.ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Thumbnail_" + (embedData.thumbnail ? "remove" : "add") + "_2/3")),
                        new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setLabel("Image").setCustomId("[no-check]embedEdit#Image").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(!embedData.image), new discord_js_1.ButtonBuilder().setEmoji(embedData.image ? "✅" : "⛔").setStyle(embedData.image ? discord_js_1.ButtonStyle.Success : discord_js_1.ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Image_" + (embedData.image ? "remove" : "add") + "_3/0"), new discord_js_1.ButtonBuilder().setDisabled(true).setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("‎").setCustomId("[no-check]embedEdit#4"), new discord_js_1.ButtonBuilder().setLabel("Timestamp").setCustomId("[no-check]embedEdit#Timestamp").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(!embedData.timestamp), new discord_js_1.ButtonBuilder().setEmoji(embedData.timestamp ? "✅" : "⛔").setStyle(embedData.timestamp ? discord_js_1.ButtonStyle.Success : discord_js_1.ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Timestamp_" + (embedData.timestamp ? "remove" : "add") + "_3/3")),
                        new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setLabel("Footer").setCustomId("[no-check]embedEdit#Footer").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(!embedData.footer), new discord_js_1.ButtonBuilder().setEmoji(embedData.footer ? "✅" : "⛔").setStyle(embedData.footer ? discord_js_1.ButtonStyle.Success : discord_js_1.ButtonStyle.Danger).setCustomId("[no-check]embedEdit#Footer_" + (embedData.footer ? "remove" : "add") + "_4/0"), new discord_js_1.ButtonBuilder().setDisabled(true).setStyle(discord_js_1.ButtonStyle.Secondary).setLabel("‎").setCustomId("[no-check]embedEdit#5"), new discord_js_1.ButtonBuilder().setStyle(discord_js_1.ButtonStyle.Success).setLabel("Sauvegarder").setEmoji("♻️").setCustomId("[no-check]embedEdit#save")),
                    ];
                }
                ;
            }
        }
    }
};
