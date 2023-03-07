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
        .setName("formulaire")
        .setDescription("Vous permet de créer des formulaires avec un modal")
        .setDMPermission(false),
    execute(interaction, client) {
        askWithButton([
            new discord_js_1.EmbedBuilder()
                .setTitle("Création de formulaire")
                .setColor("Gold")
                .setDescription("**Souhaitez vous créer un nouveau formulaire ?**\n\nUn formulaire c'est un embed + un bouton qui ouvre un modal, les informations saisie par les utilisateurs dans le modal sont retranscrits dans un channel choisie.")
        ], [
            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId("[no-check]form_start")
                .setStyle(discord_js_1.ButtonStyle.Primary)
                .setLabel("Commencer"), new discord_js_1.ButtonBuilder()
                .setCustomId("[no-check]form_cancel")
                .setStyle(discord_js_1.ButtonStyle.Danger)
                .setLabel("Annuler"))
        ], interaction, null, true)
            .then(inter => {
            askWithButtonToModal([
                new discord_js_1.EmbedBuilder()
                    .setTitle("Veuillez définir l'embed de votre formulaire (ceci est le titre d'un embed)")
                    .setDescription(`
                    Petit rappel de ce que c'est un embed et de ce qui vous est demandé :
                    **Titre** : Obligatoire 
                    **Description** : Obligatoire | (Ceci est la description d'un embed)
                    **Couleur (hexa)** : Optionnel | valeur par défaut -> \`Random\` 
                    **Footer** : Optionnel | pas de valeur par défaut 
                    `)
                    .setColor("Blurple")
                    .setFooter({ text: "Ceci est un footer" })
            ], [
                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]form_embed")
                    .setLabel("Cliquez pour ouvrir le modal")
                    .setStyle(discord_js_1.ButtonStyle.Secondary))
            ], inter, new discord_js_1.ModalBuilder()
                .setTitle("Form | Définission de l'embed")
                .setCustomId("[no-check]form_embed")
                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                .setCustomId("title")
                .setLabel("Insérer le titre de l'embed")
                .setMaxLength(256)
                .setRequired(true)
                .setStyle(discord_js_1.TextInputStyle.Short)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                .setCustomId("description")
                .setLabel("Insérer la description de l'embed")
                .setPlaceholder("(/p -> retour à la ligne)")
                .setMaxLength(1000)
                .setRequired(true)
                .setStyle(discord_js_1.TextInputStyle.Paragraph)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                .setCustomId("color")
                .setLabel("Insérer la couleur (hexa) de l'embed ")
                .setRequired(false)
                .setPlaceholder("couleur hexa -> #001122")
                .setMaxLength(7)
                .setStyle(discord_js_1.TextInputStyle.Short)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                .setCustomId("footer")
                .setLabel("Insérer le footer de l'embed ")
                .setRequired(false)
                .setMaxLength(2048)
                .setStyle(discord_js_1.TextInputStyle.Paragraph)))).then(inter2 => {
                const embedInput = new discord_js_1.EmbedBuilder()
                    .setTitle("Veuillez définir ce que vous souhaitez demande avec votre formulaire")
                    .setDescription(`
                    Veuillez choisir le nombre de saisie de texte à mettre dans le formulaire via le menu sélectif.
                    Puis les définir avec les boutons qui vont s'activés.
                    `)
                    .setColor("Blurple");
                let SMInput = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
                    .setCustomId("[no-check]form_nbrTextInput")
                    .setPlaceholder("Choississez le nombre de saisie de texte")
                    .addOptions({
                    label: "1 saisie de texte",
                    value: "1",
                }, {
                    label: "2 saisies de texte",
                    value: "2",
                }, {
                    label: "3 saisies de texte",
                    value: "3",
                }, {
                    label: "4 saisies de texte",
                    value: "4",
                }, {
                    label: "5 saisies de texte",
                    value: "5",
                }));
                const title = inter2.fields.getTextInputValue("title");
                const description = inter2.fields.getTextInputValue("description");
                const color = inter2.fields.getTextInputValue("color");
                const footer = inter2.fields.getTextInputValue("footer");
                askWithSelectMenu([
                    embedInput
                ], [
                    SMInput
                ], inter2)
                    .then((inter3) => __awaiter(this, void 0, void 0, function* () {
                    const nbrTextInput = Number(inter3.values[0]);
                    let TextInputData = [];
                    let interTemp = inter3;
                    for (let i of (0, discord_js_1.range)(1, nbrTextInput)) {
                        yield askWithButtonToModal([
                            embedInput
                        ], [
                            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                .setCustomId(`[no-check]form_opt_${i}`)
                                .setLabel(`Cliquez pour définir la saisie de texte N°${i}`)
                                .setStyle(discord_js_1.ButtonStyle.Success))
                        ], interTemp, new discord_js_1.ModalBuilder()
                            .setTitle(`Définission de la saisie de texte N°${i}`)
                            .setCustomId(`[no-check]SDT_${i}`)
                            .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                            .setCustomId("question")
                            .setLabel("Quelle question voulez vous posez ?")
                            .setMaxLength(45)
                            .setStyle(discord_js_1.TextInputStyle.Short)
                            .setRequired(true)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                            .setCustomId("style")
                            .setLabel("Quel style ? 1 (short) ou 2 (paragraph)")
                            .setMaxLength(1)
                            .setStyle(discord_js_1.TextInputStyle.Short)
                            .setRequired(true)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                            .setCustomId("required")
                            .setLabel("Option obligatoire ? 1 (oui) ou 2 (non)")
                            .setMaxLength(1)
                            .setStyle(discord_js_1.TextInputStyle.Short)
                            .setRequired(true)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                            .setCustomId("max")
                            .setLabel("Longeur maximal du texte (1000 max)")
                            .setMaxLength(4)
                            .setStyle(discord_js_1.TextInputStyle.Short)
                            .setRequired(false)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder()
                            .setCustomId("min")
                            .setLabel("Longeur minimal du texte (1 minimum)")
                            .setMaxLength(4)
                            .setStyle(discord_js_1.TextInputStyle.Short)
                            .setRequired(false))))
                            .then(inter4 => {
                            interTemp = inter4;
                            TextInputData.push({
                                question: inter4.fields.getTextInputValue("question"),
                                style: inter4.fields.getTextInputValue("style") == 1 ? discord_js_1.TextInputStyle.Short : discord_js_1.TextInputStyle.Paragraph,
                                required: inter4.fields.getTextInputValue("required") == 1,
                                max: !inter4.fields.getTextInputValue("max") ? 1000 : Number(inter4.fields.getTextInputValue("max")) < Number(inter4.fields.getTextInputValue("min")) ? 1000 : Number(inter4.fields.getTextInputValue("max")) > 1000 ? 1000 : Number(inter4.fields.getTextInputValue("max")) > 1 ? Number(inter4.fields.getTextInputValue("max")) : 1,
                                min: !inter4.fields.getTextInputValue("min") ? 1 : Number(inter4.fields.getTextInputValue("min")) > Number(inter4.fields.getTextInputValue("max")) ? 1 : Number(inter4.fields.getTextInputValue("min")) < 1 ? 1 : Number(inter4.fields.getTextInputValue("min")) < 1000 ? Number(inter4.fields.getTextInputValue("min")) : 1000,
                            });
                        });
                    }
                    yield askWithSelectMenu([
                        new discord_js_1.EmbedBuilder()
                            .setColor("Greyple")
                            .setDescription("Veuillez définir le channel dans lequel **les formulaires remplies** seront envoyés.")
                    ], [
                        new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ChannelSelectMenuBuilder()
                            .addChannelTypes(discord_js_1.ChannelType.GuildText)
                            .setCustomId("[no-check]form_sendchannel")
                            .setMaxValues(1)
                            .setPlaceholder("Selectionnez le channel"))
                    ], interTemp)
                        .then(inter5 => {
                        const form_sendchannel = inter5.values[0];
                        askWithSelectMenu([
                            new discord_js_1.EmbedBuilder()
                                .setColor("Grey")
                                .setDescription("Veuillez définir le channel dans lequel le **message pour créer un formulaire** sera envoyé.")
                        ], [
                            new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ChannelSelectMenuBuilder()
                                .addChannelTypes(discord_js_1.ChannelType.GuildText)
                                .setCustomId("[no-check]form_messagechannel")
                                .setMaxValues(1)
                                .setPlaceholder("Selectionnez le channel"))
                        ], inter5)
                            .then(inter6 => {
                            const form_messageChannel = inter6.values[0];
                            let messageEmbed = new discord_js_1.EmbedBuilder()
                                .setTitle(title)
                                .setDescription(description.replaceAll("/p", "\n"));
                            if (footer)
                                messageEmbed.setFooter({ text: footer });
                            if (color)
                                messageEmbed.setColor(color || "Random");
                            else
                                messageEmbed.setColor("Random");
                            // @ts-ignore
                            interaction.guild.channels.cache.get(form_messageChannel).send({
                                embeds: [
                                    messageEmbed
                                ],
                            })
                                .then(msg => {
                                msg.edit({
                                    components: [
                                        new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                                            .setStyle(discord_js_1.ButtonStyle.Success)
                                            .setLabel("Créer un formulaire")
                                            .setCustomId(`formCreate#${msg.id}`))
                                    ]
                                });
                                var guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {
                                    guildId: interaction.guildId,
                                });
                                guildData.form[msg.id] = {
                                    // @ts-ignore
                                    data: TextInputData,
                                    channel: form_sendchannel
                                };
                                guildData.save();
                            });
                            inter6.update({
                                embeds: [
                                    new discord_js_1.EmbedBuilder()
                                        .setColor("Green")
                                        .setTitle("Vous avez terminé la création du formulaire !")
                                ],
                                components: [],
                                ephemeral: true
                            });
                        });
                    });
                }));
            });
        });
        function askWithButtonToModal(embed, components, interaction, modal, time = 30, reply = false, ephemeral = true) {
            if (reply) {
                var inter0 = interaction.reply({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                });
            }
            else {
                var inter0 = interaction.update({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                });
            }
            return inter0.then(msg => {
                return msg.awaitMessageComponent({
                    componentType: discord_js_1.ComponentType.Button,
                    time: time * 1000,
                    filter: i => i.customId.startsWith("[no-check]")
                })
                    .then(inter => {
                    inter.showModal(modal);
                    return inter.awaitModalSubmit({
                        time: 90 * 1000,
                        filter: i => i.customId.startsWith("[no-check]"),
                    })
                        .then(inter2 => {
                        return inter2;
                    })
                        .catch(() => {
                        components.map(row => row.components.map(component => component.setDisabled(true)));
                        interaction.editReply({
                            components: components
                        });
                    });
                }).catch(() => {
                    components.map(row => row.components.map(component => component.setDisabled(true)));
                    interaction.editReply({
                        components: components
                    });
                });
            })
                .catch(err => client.error(err));
        }
        ;
        function askWithButton(embed, components, interaction, time = 30, reply = false, ephemeral = true) {
            if (reply) {
                var inter = interaction.reply({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                });
            }
            else {
                var inter = interaction.update({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                });
            }
            return inter.then(msg => {
                return msg.awaitMessageComponent({
                    componentType: discord_js_1.ComponentType.Button,
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
                    return null;
                });
            });
        }
        function askWithSelectMenu(embed, components, interaction, time = 30, reply = false, ephemeral = true) {
            if (reply) {
                var inter = interaction.reply({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                });
            }
            else {
                var inter = interaction.update({
                    embeds: embed,
                    components: components,
                    ephemeral: ephemeral,
                });
            }
            return inter.then(msg => {
                return msg.awaitMessageComponent({
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
                    return null;
                });
            });
        }
    }
};
