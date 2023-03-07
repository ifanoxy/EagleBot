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
        .setName("ticket")
        .setDescription("Vous permet de gérer le ticket pour votre serveur.")
        .setDMPermission(false)
        .addSubcommand(sub => sub
        .setName("setup")
        .setDescription("permet de créer une configuration de ticket"))
        .addSubcommand(sub => sub
        .setName("use")
        .setDescription("Permet d'utiliser un template de ticket")
        .addStringOption(option => option.setName("template").setDescription("Quel template souhaitez vous utiliser").setAutocomplete(true).setRequired(true))
        .addChannelOption(option => option.setName("catégorie").setDescription("La catégorie où seront créer les tickets").addChannelTypes(discord_js_1.ChannelType.GuildCategory)))
        .addSubcommand(sub => sub
        .setName("delete")
        .setDescription("Permet de supprimer un template de ticket")
        .addStringOption(option => option.setName("template").setDescription("Quel template souhaitez vous supprimer").setAutocomplete(true).setRequired(true)))
        .addSubcommand(sub => sub
        .setName("list")
        .setDescription("Permet de voir la liste de tout vos 'template' de ticket")),
    autocomplete(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = client.managers.ticketsManager.getIfExist(interaction.user.id, {
                userId: interaction.user.id,
            });
            const focusedValue = interaction.options.getFocused();
            let choices = [];
            if (!userData) {
                choices.push("Vous n'avez pas de template -> /ticket-setup");
            }
            else {
                choices = Object.keys(userData.data).slice(0, 25);
            }
            const filtered = choices.filter(choice => choice.startsWith(focusedValue));
            yield interaction.respond(filtered.map(choice => ({ name: `${choice} | ${userData.data[choice].map(x => x.name.slice(0, 20) + "...").join(" / ")}`, value: choice })));
        });
    },
    execute(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            switch (interaction.options.getSubcommand()) {
                case "setup":
                    {
                        if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageGuild))
                            return interaction.reply({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setColor('Red')
                                        .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                                ],
                                ephemeral: true
                            });
                        let startButton = new discord_js_1.ButtonBuilder()
                            .setCustomId('[no-check]ticket_start')
                            .setStyle(discord_js_1.ButtonStyle.Success)
                            .setLabel("Commencer");
                        let cancelButton = new discord_js_1.ButtonBuilder()
                            .setCustomId('[no-check]ticket_cancel')
                            .setStyle(discord_js_1.ButtonStyle.Danger)
                            .setLabel('Annuler');
                        interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setTitle("Créateur de ticket personnalisable")
                                    .setColor("#2F3136")
                                    .setDescription("Vous pouvez créer un système de ticket 100% personnalisable.\nLa commande que vous venez d'effectuer vous permet de créer un 'template' de ticket que vous pourrez réutiliser le nombre de fois que vous le souhaitez !")
                                    .addFields({
                                    name: "Temps estimé",
                                    value: "entre 2 minutes et 5 minutes",
                                    inline: true,
                                })
                                    .setFooter({ text: "Vous avez 30s pour faire votre choix" })
                            ],
                            components: [
                                new discord_js_1.ActionRowBuilder().addComponents(startButton, cancelButton)
                            ],
                            ephemeral: true,
                        }).then(msg => {
                            msg.awaitMessageComponent({
                                componentType: discord_js_1.ComponentType.Button,
                                time: 30 * 1000,
                                filter: i => i.customId.startsWith("[no-check]ticket")
                            }).then(inter => {
                                if (inter.customId == "[no-check]ticket_start") {
                                    ask([
                                        new discord_js_1.EmbedBuilder().setColor("Blue").setTitle("Création ticket rapide").setFooter({ text: "Vous avez 30s pour répondre" })
                                            .setDescription("Veuillez définir quel type de ticket voulez-vous.\n\n**Menu sélectif ou Bouton.**")
                                    ], [
                                        new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("[no-check]ticket-SelectMenu")
                                            .setStyle(discord_js_1.ButtonStyle.Primary).setLabel("Menu sélectif"), new discord_js_1.ButtonBuilder().setCustomId("[no-check]ticket-Button")
                                            .setStyle(discord_js_1.ButtonStyle.Primary).setLabel("Bouton"))
                                    ], inter, discord_js_1.ComponentType.Button)
                                        .then(inter2 => {
                                        //#region Nombre de choix
                                        let selectMenuChoix = new discord_js_1.StringSelectMenuBuilder().setCustomId("[no-check]ticket_nombre_choix").setPlaceholder("Choissez le nombre d'options").setMaxValues(1);
                                        if (inter2.customId == "[no-check]ticket-SelectMenu") {
                                            for (let i = 1; i < 16; i++) {
                                                selectMenuChoix.addOptions({
                                                    label: `${i} options`,
                                                    value: i.toString()
                                                });
                                            }
                                        }
                                        else {
                                            for (let i = 1; i < 6; i++) {
                                                selectMenuChoix.addOptions({
                                                    label: `${i} options`,
                                                    value: i.toString()
                                                });
                                            }
                                        }
                                        ask([
                                            new discord_js_1.EmbedBuilder().setColor("Blue").setTitle("Création ticket rapide").setFooter({ text: "Vous avez 30s pour répondre" })
                                                .setDescription("Veuillez définir le nombre de choix possible pour votre message de ticket")
                                        ], [
                                            new discord_js_1.ActionRowBuilder().addComponents(selectMenuChoix)
                                        ], inter2, discord_js_1.ComponentType.StringSelect)
                                            .then((inter3) => __awaiter(this, void 0, void 0, function* () {
                                            //#region définission des options
                                            let options = [];
                                            let interactionNow = inter3;
                                            for (let i = 1; i < Number(inter3.values[0]) + 1; i++) {
                                                if (inter2.customId == "[no-check]ticket-SelectMenu") {
                                                    yield interactionNow.update({
                                                        embeds: [
                                                            new discord_js_1.EmbedBuilder()
                                                                .setColor("Blue")
                                                                .setTitle(`Définission des options ${i}/${inter3.values[0]}`)
                                                                .setFooter({ text: "Vous avez 1m30 pour répondres" })
                                                                .setDescription("Définissez l'options avec le nom, une description, le placeholder, l'émoji.")
                                                        ],
                                                        components: [
                                                            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                                                .setStyle(discord_js_1.ButtonStyle.Success)
                                                                .setLabel(`Cliquez pour définir l'option N°${i}`)
                                                                .setCustomId("[no-check]")),
                                                        ]
                                                    })
                                                        .then(msg => {
                                                        return msg.awaitMessageComponent({
                                                            componentType: discord_js_1.ComponentType.Button,
                                                            time: 30 * 1000,
                                                            filter: i => i.customId.startsWith("[no-check]")
                                                        })
                                                            .then(interTemp => {
                                                            const ModalOption = new discord_js_1.ModalBuilder()
                                                                .setCustomId("[no-check]ticket_define_choice")
                                                                .setTitle(`Définission des options ${i}/${inter3.values[0]}`)
                                                                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                                                                .setCustomId("name")
                                                                .setLabel("Quel est le nom de cette option ?")
                                                                .setStyle(discord_js_1.TextInputStyle.Short)
                                                                .setMaxLength(90)
                                                                .setRequired(true)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                                                                .setCustomId("description")
                                                                .setLabel("Définissez une petite description")
                                                                .setStyle(discord_js_1.TextInputStyle.Short)
                                                                .setMaxLength(90)
                                                                .setRequired(true)));
                                                            if (i == 1) {
                                                                ModalOption.addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                                                                    .setCustomId("placeholder")
                                                                    .setLabel("Définissez le placeHolder")
                                                                    .setStyle(discord_js_1.TextInputStyle.Short)
                                                                    .setMaxLength(90)
                                                                    .setRequired(false)));
                                                            }
                                                            interTemp.showModal(ModalOption);
                                                            return interTemp.awaitModalSubmit({
                                                                filter: i => i.customId == "[no-check]ticket_define_choice",
                                                                time: 2 * 60 * 1000,
                                                            })
                                                                .then(interTemp2 => {
                                                                interactionNow = interTemp2;
                                                                const name = interTemp2.fields.getTextInputValue("name");
                                                                const description = interTemp2.fields.getTextInputValue("description");
                                                                if (i == 1) {
                                                                    const placeHolder = interTemp2.fields.getTextInputValue("placeholder");
                                                                    options.push({
                                                                        name: name,
                                                                        description: description,
                                                                        placeHolder: placeHolder || null
                                                                    });
                                                                }
                                                                else {
                                                                    options.push({
                                                                        name: name,
                                                                        description: description,
                                                                    });
                                                                }
                                                                ;
                                                                return 1;
                                                            });
                                                        })
                                                            .catch(reason => {
                                                            msg.components.map(row => row.components.map(component => component.data.disabled = true));
                                                            interaction.editReply({
                                                                components: msg.components
                                                            });
                                                            return 0;
                                                        });
                                                    })
                                                        .catch(err => client.error(err));
                                                }
                                                else {
                                                    yield interactionNow.update({
                                                        embeds: [
                                                            new discord_js_1.EmbedBuilder()
                                                                .setColor("Blue")
                                                                .setTitle(`Définission des options ${i}/${inter3.values[0]}`)
                                                                .setFooter({ text: "Vous avez 1m30 pour répondres" })
                                                                .setDescription("Définissez l'options avec le nom, une description, la couleur du bouton, l'émoji.")
                                                        ],
                                                        components: [
                                                            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                                                .setStyle(discord_js_1.ButtonStyle.Success)
                                                                .setLabel(`Cliquez pour définir l'option N°${i}`)
                                                                .setCustomId("[no-check]"))
                                                        ]
                                                    })
                                                        .then(msg => {
                                                        return msg.awaitMessageComponent({
                                                            componentType: discord_js_1.ComponentType.Button,
                                                            time: 30 * 1000,
                                                            filter: i => i.customId.startsWith("[no-check]")
                                                        })
                                                            .then(interTemp => {
                                                            const ModalOption = new discord_js_1.ModalBuilder()
                                                                .setCustomId("[no-check]ticket_define_choice")
                                                                .setTitle(`Définission des options ${i}/${inter3.values[0]}`)
                                                                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                                                                .setCustomId("name")
                                                                .setLabel("Quel est le nom de cette option ?")
                                                                .setStyle(discord_js_1.TextInputStyle.Short)
                                                                .setMaxLength(90)
                                                                .setRequired(true)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                                                                .setCustomId("description")
                                                                .setLabel("Définissez une petite description")
                                                                .setStyle(discord_js_1.TextInputStyle.Short)
                                                                .setMaxLength(90)
                                                                .setRequired(true)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                                                                .setCustomId("color")
                                                                .setLabel("Définissez la couleur du bouton")
                                                                .setPlaceholder("rouge | bleu | vert | gris")
                                                                .setStyle(discord_js_1.TextInputStyle.Short)
                                                                .setMaxLength(90)
                                                                .setRequired(false)));
                                                            interTemp.showModal(ModalOption);
                                                            return interTemp.awaitModalSubmit({
                                                                filter: i => i.customId == "[no-check]ticket_define_choice",
                                                                time: 2 * 60 * 1000,
                                                            })
                                                                .then(interTemp2 => {
                                                                interactionNow = interTemp2;
                                                                const name = interTemp2.fields.getTextInputValue("name");
                                                                const description = interTemp2.fields.getTextInputValue("description");
                                                                let color = interTemp2.fields.getTextInputValue("color");
                                                                switch (color.toLocaleUpperCase()) {
                                                                    case "ROUGE":
                                                                        {
                                                                            color = discord_js_1.ButtonStyle.Danger;
                                                                        }
                                                                        break;
                                                                    case "BLEU":
                                                                        {
                                                                            color = discord_js_1.ButtonStyle.Primary;
                                                                        }
                                                                        break;
                                                                    case "VERT":
                                                                        {
                                                                            color = discord_js_1.ButtonStyle.Success;
                                                                        }
                                                                        break;
                                                                    case "GRIS":
                                                                        {
                                                                            color = discord_js_1.ButtonStyle.Secondary;
                                                                        }
                                                                        break;
                                                                    default: color = discord_js_1.ButtonStyle.Primary;
                                                                }
                                                                options.push({
                                                                    name: name,
                                                                    description: description,
                                                                    color: color
                                                                });
                                                                return 1;
                                                            });
                                                        })
                                                            .catch(reason => {
                                                            msg.components.map(row => row.components.map(component => component.data.disabled = true));
                                                            interaction.editReply({
                                                                components: msg.components
                                                            });
                                                            return 0;
                                                        });
                                                    })
                                                        .catch(err => client.error(err));
                                                }
                                                ;
                                            }
                                            ;
                                            interactionNow.update({
                                                embeds: [
                                                    new discord_js_1.EmbedBuilder()
                                                        .setTitle("Vous avez terminé la création de votre Ticket")
                                                        .setDescription(`Vous pouvez Utiliser ce 'template' en utilisant la commande ${client.application.commands.cache.filter(i => i.name == "ticket-use").map(a => `</${a.name}:${a.id}>`)}`)
                                                        .setColor("Green")
                                                ],
                                                components: []
                                            });
                                            let database = client.managers.ticketsManager.getAndCreateIfNotExists(interaction.user.id, {
                                                userId: interaction.user.id,
                                            });
                                            database.data[`${interaction.user.id}_${Object.keys(database.data).length}`] = options;
                                            database.save();
                                            //#endregion
                                        }));
                                        //#endregion
                                    });
                                }
                                else {
                                    interaction.deleteReply();
                                }
                            }).catch(reason => {
                                msg.components.map(row => row.components.map(component => component.data.disabled = true));
                                interaction.editReply({
                                    components: msg.components
                                });
                            });
                        });
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
                                    return inter;
                                }).catch(reason => {
                                    components.map(row => row.components.map(component => component.setDisabled(true)));
                                    interaction.editReply({
                                        components: components
                                    });
                                });
                            })
                                .catch(err => client.error(err));
                        }
                    }
                    break;
                case "use":
                    {
                        if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageGuild))
                            return interaction.reply({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setColor('Red')
                                        .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                                ],
                                ephemeral: true
                            });
                        const userData = client.managers.ticketsManager.getIfExist(interaction.user.id, {
                            userId: interaction.user.id,
                        });
                        if (!userData)
                            return interaction.reply({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setColor("DarkPurple")
                                        .setTitle("Vous n'avez pas de template de ticket")
                                        .setDescription(`Utiliser la commande ${client.application.commands.cache.filter(i => i.name == "ticket-setup").map(a => `</${a.name}:${a.id}>`)} pour en créer`)
                                ],
                                ephemeral: true
                            });
                        const ticketsData = userData.data[interaction.options.getString("template")];
                        let categorie = interaction.options.getChannel("catégorie");
                        if (!categorie) {
                            yield interaction.guild.channels.create({
                                type: discord_js_1.ChannelType.GuildCategory,
                                name: "Ticket",
                                topic: "Catégorie créer automatiquement pour les tickets",
                                permissionOverwrites: [
                                    {
                                        id: interaction.guild.roles.everyone.id,
                                        deny: "ViewChannel"
                                    }
                                ]
                            }).then(cate => {
                                categorie = cate;
                            });
                        }
                        let rowTicket = new discord_js_1.ActionRowBuilder();
                        let selectMenuTicket = new discord_js_1.StringSelectMenuBuilder()
                            .setCustomId(`ticketCreate#${categorie.id}`)
                            .setMaxValues(1)
                            .setPlaceholder(ticketsData[0].placeHolder || "aucun");
                        let i = 0;
                        for (let ticket of ticketsData) {
                            if (ticket.color) {
                                rowTicket.addComponents(new discord_js_1.ButtonBuilder()
                                    .setCustomId(`ticketCreate#${categorie.id}#${i}`)
                                    .setStyle(ticket.color)
                                    .setLabel(ticket.name));
                            }
                            else {
                                selectMenuTicket.addOptions({
                                    label: `${ticket.name}`,
                                    description: `${ticket.description}`,
                                    value: `${ticket.name}`,
                                });
                            }
                            i++;
                        }
                        if (ticketsData[0].placeHolder) {
                            rowTicket.addComponents(selectMenuTicket);
                        }
                        interaction.channel.send({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setAuthor({ name: "Ouvrez votre ticket !", iconURL: interaction.client.user.avatarURL() })
                                    .setDescription("Afin de créer un ticket, vous devez cliquer sur un des boutons/menu sélectif.\n\nLes différentes options possibles sont :")
                                    .addFields(ticketsData.map(data => {
                                    return {
                                        name: data.name,
                                        value: data.description,
                                    };
                                }))
                                    .setColor("Gold")
                                    .setFooter({ text: "Ticket" })
                            ],
                            components: [
                                rowTicket
                            ]
                        });
                        interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setTitle("Le message de ticket à été envoyé avec succès !")
                                    .setColor("Blurple")
                            ],
                            ephemeral: true
                        });
                    }
                    break;
                case "delete":
                    {
                        if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageGuild))
                            return interaction.reply({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setColor('Red')
                                        .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                                ],
                                ephemeral: true
                            });
                        let userData = client.managers.ticketsManager.getIfExist(interaction.user.id);
                        if (!userData || Object.keys(userData.data).length == 0)
                            return interaction.reply({
                                embeds: [
                                    new discord_js_1.EmbedBuilder().setColor("Red").setDescription("Vous n'avez aucun template de ticket")
                                ], ephemeral: true
                            });
                        delete userData.data[interaction.options.getString("template")];
                        userData.save();
                        interaction.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setColor("Blurple")
                                    .setDescription(`Vous avez supprimé avec succès la template "${interaction.options.getString("template")}"`)
                            ]
                        });
                    }
                    break;
                case "list":
                    {
                        if (!interaction.member.permissions.has(discord_js_1.PermissionsBitField.Flags.ManageGuild))
                            return interaction.reply({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setColor('Red')
                                        .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
                                ],
                                ephemeral: true
                            });
                        const userData = client.managers.ticketsManager.getIfExist(interaction.user.id);
                        let Embed = new discord_js_1.EmbedBuilder().setColor("Green").setTitle(`Liste de vos ${Object.keys(userData.data).length} templates de ticket`);
                        let Row = new discord_js_1.ActionRowBuilder()
                            .addComponents(new discord_js_1.ButtonBuilder()
                            .setCustomId("[no-check]Previous")
                            .setDisabled(true)
                            .setEmoji("◀️")
                            .setStyle(1), new discord_js_1.ButtonBuilder()
                            .setCustomId("[no-check]")
                            .setDisabled(true)
                            .setLabel(`1/${Math.ceil(Object.keys(userData.data).length / 25)}`)
                            .setStyle(1), new discord_js_1.ButtonBuilder()
                            .setCustomId("[no-check]Next")
                            .setDisabled(false)
                            .setEmoji("▶️")
                            .setStyle(1));
                        for (const data of Object.keys(userData.data)) {
                            let i = ((_a = Embed === null || Embed === void 0 ? void 0 : Embed.data.fields) === null || _a === void 0 ? void 0 : _a.length) || 0;
                            let k = 0;
                            Embed.addFields({
                                name: `ID: ${data}`,
                                value: `**Type:** ${userData.data[data][0].placeHolder ? "Menu Sélectif" : "Bouton"}\n**Option(s):**\n${userData.data[data].map(ticket => { k++; return `${k}. ${ticket.name}`; }).join("\n")}`,
                                inline: true
                            });
                            if (i > 24)
                                break;
                        }
                        if (Object.keys(userData.data).length <= 24) {
                            interaction.reply({
                                embeds: [
                                    Embed
                                ],
                                ephemeral: true
                            });
                        }
                        else {
                            interaction.reply({
                                embeds: [
                                    Embed
                                ],
                                components: [
                                    Row
                                ],
                                ephemeral: true
                            }).then(msg => {
                                messageEdit(msg, interaction);
                            });
                            function messageEdit(msg, interaction) {
                                const collector = msg.createMessageComponentCollector({
                                    time: 15 * 1000,
                                    componentType: discord_js_1.ComponentType.Button,
                                    max: 1
                                });
                                collector.on('collect', inter => {
                                    const reponse = inter.customId.replace("[no-check]", "");
                                    const position = inter.message.components[0].components[1].label.split("/");
                                    Embed.setFields();
                                    switch (reponse) {
                                        case "Previous":
                                            {
                                                let i = (Number(position[0]) - 1) * 25 - 1;
                                                let j = (Number(position[0]) - 1) * 25 - 25;
                                                while (j <= i && j < Object.keys(userData.data).length) {
                                                    let k = 0;
                                                    Embed.addFields({
                                                        name: `ID: ${Object.keys(userData.data)[j]}`,
                                                        value: `**Type:** ${userData.data[Object.keys(userData.data)[j]][0].placeHolder ? "Menu Sélectif" : "Bouton"}\n**Option(s):**\n${userData.data[Object.keys(userData.data)[j]].map(ticket => { k++; return `${k}. ${ticket.name}`; }).join("\n")}`,
                                                        inline: true
                                                    });
                                                    j++;
                                                }
                                                if (Number(position[0]) - 1 == 1) {
                                                    Row.components[0].setDisabled(true);
                                                }
                                                Row.components[2].setDisabled(false);
                                                Row.components[1].setLabel(`${Number(position[0]) - 1}/${position[1]}`);
                                                inter.update({
                                                    embeds: [
                                                        Embed
                                                    ],
                                                    components: [
                                                        Row
                                                    ]
                                                }).then(msg => {
                                                    messageEdit(msg, interaction);
                                                });
                                            }
                                            break;
                                        case "Next":
                                            {
                                                let i = Number(position[0]) * 25 + 24;
                                                let j = Number(position[0]) * 25;
                                                while (j <= i && j < Object.keys(userData.data).length) {
                                                    let k = 0;
                                                    Embed.addFields({
                                                        name: `ID: ${Object.keys(userData.data)[j]}`,
                                                        value: `**Type:** ${userData.data[Object.keys(userData.data)[j]][0].placeHolder ? "Menu Sélectif" : "Bouton"}\n**Option(s):**\n${userData.data[Object.keys(userData.data)[j]].map(ticket => { k++; return `${k}. ${ticket.name}`; }).join("\n")}`,
                                                        inline: true
                                                    });
                                                    j++;
                                                }
                                                if (Number(position[0]) + 1 == position[1]) {
                                                    Row.components[2].setDisabled(true);
                                                }
                                                Row.components[0].setDisabled(false);
                                                Row.components[1].setLabel(`${Number(position[0]) + 1}/${position[1]}`);
                                                inter.update({
                                                    embeds: [
                                                        Embed
                                                    ],
                                                    components: [
                                                        Row
                                                    ]
                                                }).then(msg => {
                                                    messageEdit(msg, interaction);
                                                });
                                            }
                                            break;
                                    }
                                });
                                collector.on("end", (coll, reason) => {
                                    if (reason != "time")
                                        return;
                                    Row.components[0].setDisabled(true);
                                    Row.components[2].setDisabled(true);
                                    interaction.editReply({
                                        components: [
                                            Row
                                        ]
                                    });
                                });
                            }
                        }
                    }
                    break;
            }
        });
    }
};
