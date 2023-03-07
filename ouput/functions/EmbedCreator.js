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
class EmbedCreator {
    constructor(func) {
        this.func = func;
    }
    askBase(interaction, CreatorEmbed, CreatorModal) {
        if (!interaction)
            return;
        return interaction.update({
            embeds: [
                CreatorEmbed
            ],
            components: [
                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]embedCreator_openModal")
                    .setLabel("Ouvrir le modal")
                    .setStyle(discord_js_1.ButtonStyle.Secondary))
            ],
            fetchReply: true
        })
            .then(msg => {
            return this.func.utils.askWithButton(msg)
                .then(interactionButton => {
                if (!interactionButton)
                    return null;
                return this.func.utils.askWithModal(interactionButton, CreatorModal, 150)
                    .then(interactionModal => {
                    if (!interactionModal)
                        return null;
                    return interactionModal;
                })
                    .catch(() => {
                    msg.components.map(row => row.components.map(x => x.disabled == true));
                    msg.edit({
                        components: msg.components
                    });
                    return null;
                });
            })
                .catch(() => {
                msg.components.map(row => row.components.map(x => x.disabled == true));
                msg.edit({
                    components: msg.components
                });
                return null;
            });
        });
    }
    ;
    askAuthor(embed, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const interactionModal = yield this.askBase(interaction, new discord_js_1.EmbedBuilder()
                .setTitle("Création du 'Auteur' de l'embed")
                .setColor("Blurple")
                .setDescription(`La partie auteur d'un embed se situe au dessus du titre mais est plus petite, il se compose de 3 options:
            
            **1. name**  --> Le texte (Obligatoire)
            **1. icon**  --> L'image à gauche du texte (Optionnel)
            **1. URL**  --> Un lien en cliquant sur le texte (Optionnel)
            `), new discord_js_1.ModalBuilder()
                .setTitle("Créateur d'embed | Auteur")
                .setCustomId("[no-check]embedCreator_modal")
                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("name").setLabel("name (le texte)").setMaxLength(256).setRequired(true).setStyle(1)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("iconURL").setLabel("icon (le lien vers une image)").setMaxLength(64).setRequired(false).setStyle(1)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("URL").setLabel("URL (le quand on clique sur le text)").setMaxLength(256).setRequired(false).setStyle(1))));
            if (!interactionModal)
                return { embed: embed, interaction: interactionModal };
            embed.setAuthor({
                name: interactionModal.fields.getTextInputValue("name"),
                iconURL: interactionModal.fields.getTextInputValue("iconURL") || null,
                url: interactionModal.fields.getTextInputValue("URL") || null,
            });
            return { embed: embed, interaction: interactionModal };
        });
    }
    ;
    askTitle(embed, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const interactionModal = yield this.askBase(interaction, new discord_js_1.EmbedBuilder()
                .setTitle("Création du 'Titre' de l'embed")
                .setColor("Blurple")
                .setDescription(`La partie titre d'un embed ce trouve tout en haut et est écrit en gras (vous pouvez seulement souligner).
            Vous pouvez aussi y ajouter un lien.
            **1. Titre**  --> Le titre (Obligatoire)
            **1. Titre-url**  --> Le lien cliquable sur le titre (Optionnel)
            `), new discord_js_1.ModalBuilder()
                .setTitle("Créateur d'embed | Titre")
                .setCustomId("[no-check]embedCreator_modal")
                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("titre").setLabel("titre").setMaxLength(256).setRequired(true).setStyle(1)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("titre_url").setLabel("titre URL").setMaxLength(64).setRequired(false).setStyle(1))));
            if (!interactionModal)
                return { embed: embed, interaction: interactionModal };
            embed.setURL(interactionModal.fields.getTextInputValue("titre_url") || null);
            embed.setTitle(interactionModal.fields.getTextInputValue("titre"));
            return { embed: embed, interaction: interactionModal };
        });
    }
    ;
    askDescription(embed, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const interactionModal = yield this.askBase(interaction, new discord_js_1.EmbedBuilder()
                .setTitle("Création de la 'Description' de l'embed")
                .setColor("Blurple")
                .setDescription(`La partie description d'un embed ce trouve en dessous du titre.
            **1. Description**  --> La descruption (Obligatoire)
            `), new discord_js_1.ModalBuilder()
                .setTitle("Créateur d'embed | Description")
                .setCustomId("[no-check]embedCreator_modal")
                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("description").setLabel("Description").setMaxLength(2048).setRequired(true).setStyle(2))));
            if (!interactionModal)
                return { embed: embed, interaction: interactionModal };
            embed.setDescription(interactionModal.fields.getTextInputValue("description"));
            return { embed: embed, interaction: interactionModal };
        });
    }
    ;
    askColor(embed, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const interactionModal = yield this.askBase(interaction, new discord_js_1.EmbedBuilder()
                .setTitle("Création de la 'Couleur' de l'embed")
                .setColor("Blurple")
                .setDescription(`La couleur de l'embed peut être une couleur hexadécimal ou en "Random"`), new discord_js_1.ModalBuilder()
                .setTitle("Créateur d'embed | Couleur")
                .setCustomId("[no-check]embedCreator_modal")
                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("color").setLabel("Couleur hexadécimal").setMaxLength(7).setPlaceholder("ex: 'Random' ou '#9da837'").setRequired(true).setStyle(1))));
            if (!interactionModal)
                return { embed: embed, interaction: interactionModal };
            embed.setColor(interactionModal.fields.getTextInputValue("color") || 'Random');
            return { embed: embed, interaction: interactionModal };
        });
    }
    askThumbnail(embed, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const interactionModal = yield this.askBase(interaction, new discord_js_1.EmbedBuilder()
                .setTitle("Création de la 'Miniature' de l'embed")
                .setColor("Blurple")
                .setDescription(`La miniature de l'embed apparait juste à côté du titre`), new discord_js_1.ModalBuilder()
                .setTitle("Créateur d'embed | Thumbnail")
                .setCustomId("[no-check]embedCreator_modal")
                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("url").setLabel("Lien d'une image").setMaxLength(64).setRequired(true).setStyle(1))));
            if (!interactionModal)
                return { embed: embed, interaction: interactionModal };
            embed.setThumbnail(interactionModal.fields.getTextInputValue("url"));
            return { embed: embed, interaction: interactionModal };
        });
    }
    ;
    askImage(embed, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const interactionModal = yield this.askBase(interaction, new discord_js_1.EmbedBuilder()
                .setTitle("Création de l' 'Image' de l'embed")
                .setColor("Blurple")
                .setDescription(`L'image de l'embed se trouve juste au dessus du footer`), new discord_js_1.ModalBuilder()
                .setTitle("Créateur d'embed | Thumbnail")
                .setCustomId("[no-check]embedCreator_modal")
                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("url").setLabel("Lien de l'image").setMaxLength(64).setRequired(true).setStyle(1))));
            if (!interactionModal)
                return { embed: embed, interaction: interactionModal };
            embed.setThumbnail(interactionModal.fields.getTextInputValue("url"));
            return { embed: embed, interaction: interactionModal };
        });
    }
    ;
    askTimestamp(embed, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const interactionModal = yield this.askBase(interaction, new discord_js_1.EmbedBuilder()
                .setTitle("Création du 'TimeStamp' de l'embed")
                .setColor("Blurple")
                .setDescription(`Le timestamp d'un embed se trouve à côté du footer et défini une date.`), new discord_js_1.ModalBuilder()
                .setTitle("Créateur d'embed | TimeStamp")
                .setCustomId("[no-check]embedCreator_modal")
                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("time").setLabel("Temps en Milisecond (ou now)").setMaxLength(64).setRequired(true).setStyle(1))));
            if (!interactionModal)
                return { embed: embed, interaction: interactionModal };
            embed.setTimestamp(interactionModal.fields.getTextInputValue("time") == "now" ? Date.now() : Number(interactionModal.fields.getTextInputValue("time")));
            return { embed: embed, interaction: interactionModal };
        });
    }
    askFooter(embed, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const interactionModal = yield this.askBase(interaction, new discord_js_1.EmbedBuilder()
                .setTitle("Création du 'Footer' de l'embed")
                .setColor("Blurple")
                .setDescription(`Le footer d'un embed se trouve tout en bas de celui-ci, il peut contenir:
            
            **1. Text** --> le texte du footer
            **1. Icon URL** --> l'icon que vous souhaitez mettre à côté du texte
            `), new discord_js_1.ModalBuilder()
                .setTitle("Créateur d'embed | Footer")
                .setCustomId("[no-check]embedCreator_modal")
                .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("text").setLabel("Texte du footer").setMaxLength(64).setRequired(true).setStyle(1)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("url").setLabel("Lien de l'image").setMaxLength(64).setRequired(false).setStyle(1))));
            if (!interactionModal)
                return { embed: embed, interaction: interactionModal };
            embed.setFooter({
                text: interactionModal.fields.getTextInputValue("text"),
                iconURL: interactionModal.fields.getTextInputValue("url") || null,
            });
            return { embed: embed, interaction: interactionModal };
        });
    }
    askFields(embed, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let nowInteraction;
            let row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
                .setCustomId("[no-check]embedCreator_fields")
                .setMaxValues(1));
            for (let i of [...Array(15).keys()]) {
                row.components[0].addOptions({
                    label: `${i + 1} Fields`,
                    value: `${i + 1}`
                });
            }
            return yield interaction.update({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setTitle("Création des 'Fields' de l'embed")
                        .setColor("Blurple")
                        .setDescription(`Les fields d'un embed se trouve entre la description et l'image.
                Vous devez tout d'abord définir le nombre de fields que vous souhaitez.
                `),
                ],
                components: [row]
            }).then(msg => {
                return this.func.utils.askWithSelectMenuString(msg, 45).then((interactionSelectMenu) => __awaiter(this, void 0, void 0, function* () {
                    if (!interactionSelectMenu)
                        return;
                    nowInteraction = interactionSelectMenu;
                    const value = interactionSelectMenu.values;
                    for (let i of [...Array(Number(value)).keys()]) {
                        nowInteraction = yield this.askBase(nowInteraction, new discord_js_1.EmbedBuilder()
                            .setTitle(`Création du 'Field' ${i + 1}/${value}`)
                            .setColor("Blurple")
                            .setDescription(`Un field contient:
                        
                        **1. name** --> Le titre du field
                        **2. Value** --> La 'description' du field,
                        **3. inline** --> Quand Actif cela alligne les fields selon les options des autres (3 par lignes max)
                        `), new discord_js_1.ModalBuilder()
                            .setTitle("Créateur d'embed | Fields")
                            .setCustomId("[no-check]embedCreator_modal")
                            .addComponents(new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("name").setLabel("Le titre du field").setMaxLength(128).setRequired(true).setStyle(1)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("value").setLabel("La description du field").setMaxLength(1024).setRequired(true).setStyle(2)), new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.TextInputBuilder().setCustomId("inline").setLabel("inline 0 -> Inactif | 1 -> Actif").setMaxLength(1).setRequired(false).setStyle(1))));
                        if (!nowInteraction)
                            return { embed: embed, interaction: nowInteraction };
                        embed.addFields({
                            name: nowInteraction.fields.getTextInputValue("name"),
                            value: nowInteraction.fields.getTextInputValue("value"),
                            inline: (nowInteraction.fields.getTextInputValue("inline") == "1"),
                        });
                    }
                    return { embed: embed, interaction: nowInteraction };
                }));
            });
        });
    }
}
exports.default = EmbedCreator;
