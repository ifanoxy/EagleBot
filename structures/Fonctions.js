const { CommandInteraction, EmbedBuilder, Message, ComponentType, ActionRowBuilder, ButtonInteraction, StringSelectMenuInteraction, MessageComponentInteraction, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder } = require("discord.js");

class EagleFonctions {
    #client;

    constructor (EagleClient) {
        this.#client = EagleClient;
        this.embedCreator = new EmbedCreator(this);
    };

    /**
     * 
     * @param {"anti-bot" | "anti-massChannel" | "anti-massBan" | "anti-massUnban" | "anti-massKick" | "anti-massSticker" | "anti-massEmoji" |"anti-newAccount" | "anti-webhook" | "anti-admin"} AntiRaidType
     * @param {CommandInteraction} interaction 
     * @param {{status: Boolean, frequence: string | null, ignoreWhitelist: Boolean, sanction: String | null}} value
     * @param {String | undefined} subGroup
     * @returns void
     */
    desactivateAntiRaid(AntiRaidType, interaction, value, subGroup) {
        if (!interaction)
        throw new Error("Vous devez définir l'interaction");

        let database = this.#client.managers.antiraidManager.getIfExist(interaction.guildId);
        if (database) {
            if (subGroup) 
                database.status[AntiRaidType][subGroup] = value;
            else
                database.status[AntiRaidType] = value;
                database.save();
            if (database.log) {
                const channel = interaction.guild.channels.cache.get(database.log);
                if (!channel) return database.log = null;
                channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({name: "Protect Logs"})
                        .setColor("#2f3136")
                        .setTitle(`Désactivation de l'${AntiRaidType} ${subGroup || ""}`)
                        .setDescription(`Action effectuer par <@${interaction.user.id}> (${interaction.user.id})`)
                        .setThumbnail("https://img.icons8.com/stickers/128/close-window.png")
                        .setTimestamp()
                    ]
                })
            }
        };
    };
    /**
     * 
     * @param {"anti-bot" | "anti-massChannel" | "anti-massBan" | "anti-massUnban" | "anti-massKick" | "anti-massSticker" | "anti-massEmoji" |"anti-newAccount" | "anti-webhook" | "anti-admin"} AntiRaidType
     * @param {CommandInteraction} interaction 
     * @param {{status: Boolean, frequence: string | null, ignoreWhitelist: Boolean, sanction: String | null}} value
     * @param {String | undefined} subGroup
     * @returns void
     */
    activateAntiRaid(AntiRaidType, interaction, value, subGroup) {
        if (!interaction)
        throw new Error("Vous devez définir l'interaction");

        let database = this.#client.managers.antiraidManager.getAndCreateIfNotExists(interaction.guildId, {guildId: interaction.guildId});
        
        if (subGroup)
        database.status[AntiRaidType][subGroup] = value;
        else 
        database.status[AntiRaidType] = value;

        database.save();
        if (database.log) {
            const channel = interaction.guild.channels.cache.get(database.log);
            if (!channel) return database.log = null;
            channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor("#2f3136")
                    .setAuthor({name: "Protect Logs"})
                    .setTitle(`Activation de l'${AntiRaidType} ${subGroup || ""}`)
                    .setDescription(`Action effectuer par <@${interaction.user.id}> (${interaction.user.id})`)
                    .setThumbnail("https://img.icons8.com/stickers/128/checked-2.png")
                    .setTimestamp()
                ]
            })
        }
    };

    /**
     * 
     * @param {String} stringTest 
     * @param {"x/yt"} frequenceType 
     */
    checkFrequence(stringTest, frequenceType) {
        let separator = frequenceType[1];
        const stringSplit = stringTest.split(separator);

        if (typeof Number(stringSplit[0]) != "number") return false;
        if (typeof Number(stringSplit[1].slice(0, stringSplit[1].length - 1)) != "number") return false;
        
        return true;
    };

    /**
     * 
     * @param {Message} msg 
     * @param {ActionRowBuilder} components
     * @returns 
     */
    askWithButton(msg, components, interaction, time = 30) {
        return msg.awaitMessageComponent({
            componentType: ComponentType.Button,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
        .then(inter => {
            return inter
        })
        .catch(() => {
            components.components.map(row => row.setDisabled(true));
            interaction.editReply({
                components: [components]
            });
            return null
        })
    }
    /**
     * 
     * @param {Message} msg 
     * @param {Number} time
     * @param {ActionRowBuilder} components
     * @returns 
     */
    askWithSelectMenuChannel(msg, components, interaction, time = 30) {
        return msg.awaitMessageComponent({
            componentType: ComponentType.ChannelSelect,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
        .then(inter => {
            return inter
        })
        .catch(() => {
            components.components.map(row => row.setDisabled(true));
            interaction.editReply({
                components: [components]
            });
            return null
        })
    }
    /**
     * 
     * @param {Message} msg 
     * @param {Number} time
     * @param {ActionRowBuilder} components
     * @returns 
     */
    askWithSelectMenuRole(msg, components, interaction, time = 30) {
        return msg.awaitMessageComponent({
            componentType: ComponentType.RoleSelect,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
        .then(inter => {
            return inter
        })
        .catch(() => {
            components.components.map(row => row.setDisabled(true));
            interaction.editReply({
                components: [components]
            });
            return null
        })
    }
    
    /**
     * 
     * @param {Message} msg 
     * @param {Number} time
     * @param {ActionRowBuilder} components
     * @returns 
     */
    askWithSelectMenuString(msg, components, interaction, time = 30) {
        return msg.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
        .then(inter => {
            return inter
        })
        .catch(() => {
            components.components.map(row => row.setDisabled(true));
            interaction.editReply({
                components: [components]
            });
            return null
        })
    }

    /**
     * 
     * @param {ButtonInteraction} inter 
     * @param {ModalBuilder} modal 
     * @param {Number} time 
     */
    askWithModal(inter, modal, time = 120, interaction) {
        inter.showModal(modal);
        return inter.awaitModalSubmit({
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000,
        })
        .then(inter => {
            return inter
        })
        .catch(() => {
            inter.message.components.map(row => row.components.map(cp => cp.disabled = true));
            interaction.editReply({
                components: [components]
            });
            return null
        })
    }
}

class EmbedCreator {

    #fonctions;

    /**
     * 
     * @param {EagleFonctions} EagleFonctions 
     */
    constructor (EagleFonctions) {
        this.#fonctions = EagleFonctions
    }

    /**
     * 
     * @param {MessageComponentInteraction} interaction 
     * @param {CommandInteraction} failInteraction 
     * @param {EmbedBuilder} CreatorEmbed 
     * @param {ModalBuilder} CreatorModal 
     */
    askBase(interaction, failInteraction, CreatorEmbed, CreatorModal) {
        return interaction.update({
            embeds: [
                CreatorEmbed
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]embedCreator_openModal")
                    .setLabel("Ouvrir le modal")
                    .setStyle(ButtonStyle.Secondary)
                )
            ]
        })
        .then(msg => {
            return this.#fonctions.askWithButton(
                msg,
                [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                        .setCustomId("[no-check]embedCreator_openModal")
                        .setLabel("Ouvrir le modal")
                        .setStyle(ButtonStyle.Secondary)
                    )
                ],
                interaction
            )
            .then(interactionButton => {
                if (!interactionButton)return null;
                return this.#fonctions.askWithModal(
                    interactionButton,
                    CreatorModal,
                    150,
                    interaction,
                )
                .then(interactionModal => {
                    if (!interactionModal)return null;
                    return interactionModal;
                })
                .catch(() => {
                    msg.components.map(row => row.components.map(x => x.disabled == true))
                    failInteraction.editReply({
                        components: msg.components
                    });
                    return null;
                });
            })
            .catch(() => {
                msg.components.map(row => row.components.map(x => x.disabled == true))
                failInteraction.editReply({
                    components: msg.components
                });
                return null;
            });
        });
    };

    /**
     * 
     * @param {EmbedBuilder} embed 
     * @param {MessageComponentInteraction} interaction 
     * @param {CommandInteraction} failInteraction 
     */
    async askAuthor(embed, interaction, failInteraction) {
        const interactionModal = await this.askBase(
            interaction,
            failInteraction,
            new EmbedBuilder()
            .setTitle("Création du 'Auteur' de l'embed")
            .setColor("Blurple")
            .setDescription(`La partie auteur d'un embed se situe au dessus du titre mais est plus petite, il se compose de 3 options:
            
            **1. name**  --> Le texte (Obligatoire)
            **1. icon**  --> L'image à gauche du texte (Optionnel)
            **1. URL**  --> Un lien en cliquant sur le texte (Optionnel)
            `),
            new ModalBuilder()
            .setTitle("Créateur d'embed | Auteur")
            .setCustomId("[no-check]embedCreator_modal")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("name").setLabel("name (le texte)").setMaxLength(256).setRequired(true).setStyle(1)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("iconURL").setLabel("icon (le lien vers une image)").setMaxLength(64).setRequired(false).setStyle(1)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("URL").setLabel("URL (le quand on clique sur le text)").setMaxLength(256).setRequired(false).setStyle(1)
                ),
            ),
        );
        
        embed.setAuthor({
            name: interactionModal.fields.getTextInputValue("name"),
            iconURL: interactionModal.fields.getTextInputValue("iconURL") || null,
            url: interactionModal.fields.getTextInputValue("URL") || null,
        });

        return {embed: embed, interaction: interactionModal };
    }

    /**
     * 
     * @param {EmbedBuilder} embed 
     * @param {MessageComponentInteraction} interaction 
     * @param {CommandInteraction} failInteraction 
     */
    async askTitle(embed, interaction, failInteraction) {
        const interactionModal = await this.askBase(
            interaction,
            failInteraction,
            new EmbedBuilder()
            .setTitle("Création du 'Titre' de l'embed")
            .setColor("Blurple")
            .setDescription(`La partie titre d'un embed ce trouve tout en haut et est écrit en gras (vous pouvez seulement souligner).
            Vous pouvez aussi y ajouter un lien.

            **1. Titre**  --> Le titre (Obligatoire)
            **1. Titre-url**  --> Le lien cliquable sur le titre (Optionnel)
            `),
            new ModalBuilder()
            .setTitle("Créateur d'embed | Titre")
            .setCustomId("[no-check]embedCreator_modal")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("titre").setLabel("titre").setMaxLength(256).setRequired(true).setStyle(1)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("titre_url").setLabel("titre URL").setMaxLength(64).setRequired(false).setStyle(1)
                ),
            ),
        );
        
        embed.setURL(interactionModal.fields.getTextInputValue("titre_url") || null);
        embed.setTitle(interactionModal.fields.getTextInputValue("titre"));

        return {embed: embed, interaction: interactionModal };
    }

    /**
     * 
     * @param {EmbedBuilder} embed 
     * @param {MessageComponentInteraction} interaction 
     * @param {CommandInteraction} failInteraction 
     */
    async askDescription(embed, interaction, failInteraction) {
        const interactionModal = await this.askBase(
            interaction,
            failInteraction,
            new EmbedBuilder()
            .setTitle("Création de la 'Description' de l'embed")
            .setColor("Blurple")
            .setDescription(`La partie description d'un embed ce trouve en dessous du titre.

            **1. Description**  --> La descruption (Obligatoire)
            `),
            new ModalBuilder()
            .setTitle("Créateur d'embed | Description")
            .setCustomId("[no-check]embedCreator_modal")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("description").setLabel("Description").setMaxLength(2048).setRequired(true).setStyle(2)
                ),
            ),
        );
        
        embed.setDescription(interactionModal.fields.getTextInputValue("description"));

        return {embed: embed, interaction: interactionModal };
    }

    /**
     * 
     * @param {EmbedBuilder} embed 
     * @param {MessageComponentInteraction} interaction 
     * @param {CommandInteraction} failInteraction 
     */
    async askColor(embed, interaction, failInteraction) {
        const interactionModal = await this.askBase(
            interaction,
            failInteraction,
            new EmbedBuilder()
            .setTitle("Création de la 'Couleur' de l'embed")
            .setColor("Blurple")
            .setDescription(`La couleur de l'embed peut être une couleur hexadécimal ou en "Random"`),
            new ModalBuilder()
            .setTitle("Créateur d'embed | Couleur")
            .setCustomId("[no-check]embedCreator_modal")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("color").setLabel("Couleur hexadécimal").setMaxLength(7).setPlaceholder("ex: 'Random' ou '#9da837'").setRequired(true).setStyle(1)
                ),
            ),
        );

        embed.setColor(interactionModal.fields.getTextInputValue("color") || 'Random');

        return {embed: embed, interaction: interactionModal };
    }

    /**
     * 
     * @param {EmbedBuilder} embed 
     * @param {MessageComponentInteraction} interaction 
     * @param {CommandInteraction} failInteraction 
     */
    async askThumbnail(embed, interaction, failInteraction) {
        const interactionModal = await this.askBase(
            interaction,
            failInteraction,
            new EmbedBuilder()
            .setTitle("Création de la 'Miniature' de l'embed")
            .setColor("Blurple")
            .setDescription(`La miniature de l'embed apparait juste à côté du titre`),
            new ModalBuilder()
            .setTitle("Créateur d'embed | Thumbnail")
            .setCustomId("[no-check]embedCreator_modal")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("url").setLabel("Lien d'une image").setMaxLength(64).setRequired(true).setStyle(1)
                ),
            ),
        );
        
        embed.setThumbnail(interactionModal.fields.getTextInputValue("url"));

        return {embed: embed, interaction: interactionModal };
    }

    /**
     * 
     * @param {EmbedBuilder} embed 
     * @param {MessageComponentInteraction} interaction 
     * @param {CommandInteraction} failInteraction 
     */
    async askImage(embed, interaction, failInteraction) {
        const interactionModal = await this.askBase(
            interaction,
            failInteraction,
            new EmbedBuilder()
            .setTitle("Création de l' 'Image' de l'embed")
            .setColor("Blurple")
            .setDescription(`L'image de l'embed se trouve juste au dessus du footer`),
            new ModalBuilder()
            .setTitle("Créateur d'embed | Thumbnail")
            .setCustomId("[no-check]embedCreator_modal")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("url").setLabel("Lien de l'image").setMaxLength(64).setRequired(true).setStyle(1)
                ),
            ),
        );
        
        embed.setThumbnail(interactionModal.fields.getTextInputValue("url"));

        return {embed: embed, interaction: interactionModal };
    }

    /**
     * 
     * @param {EmbedBuilder} embed 
     * @param {MessageComponentInteraction} interaction 
     * @param {CommandInteraction} failInteraction 
     */
    async askTimestamp(embed, interaction, failInteraction) {
        const interactionModal = await this.askBase(
            interaction,
            failInteraction,
            new EmbedBuilder()
            .setTitle("Création du 'TimeStamp' de l'embed")
            .setColor("Blurple")
            .setDescription(`Le timestamp d'un embed se trouve à côté du footer et défini une date.`),
            new ModalBuilder()
            .setTitle("Créateur d'embed | TimeStamp")
            .setCustomId("[no-check]embedCreator_modal")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("time").setLabel("Temps en Milisecond (ou now)").setMaxLength(64).setRequired(true).setStyle(1)
                ),
            ),
        );
        
        embed.setTimestamp(interactionModal.fields.getTextInputValue("time") == "now" ? Date.now() : Number(interactionModal.fields.getTextInputValue("time")));

        return {embed: embed, interaction: interactionModal };
    }

    /**
     * 
     * @param {EmbedBuilder} embed 
     * @param {MessageComponentInteraction} interaction 
     * @param {CommandInteraction} failInteraction 
     */
    async askFooter(embed, interaction, failInteraction) {
        const interactionModal = await this.askBase(
            interaction,
            failInteraction,
            new EmbedBuilder()
            .setTitle("Création du 'Footer' de l'embed")
            .setColor("Blurple")
            .setDescription(`Le footer d'un embed se trouve tout en bas de celui-ci, il peut contenir:
            
            **1. Text** --> le texte du footer
            **1. Icon URL** --> l'icon que vous souhaitez mettre à côté du texte
            `),
            new ModalBuilder()
            .setTitle("Créateur d'embed | Footer")
            .setCustomId("[no-check]embedCreator_modal")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("text").setLabel("Texte du footer").setMaxLength(64).setRequired(true).setStyle(1)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("url").setLabel("Lien de l'image").setMaxLength(64).setRequired(false).setStyle(1)
                ),
            ),
        );
        
        embed.setFooter({
            text: interactionModal.fields.getTextInputValue("text"),
            iconURL: interactionModal.fields.getTextInputValue("url")
        })

        return {embed: embed, interaction: interactionModal };
    }
}

module.exports = { EagleFonctions }