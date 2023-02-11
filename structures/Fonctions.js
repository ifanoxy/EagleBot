const { CommandInteraction, EmbedBuilder, Message, ComponentType, ActionRowBuilder, ButtonInteraction } = require("discord.js");

class EagleFonctions {
    #client;

    constructor (EagleClient) {
        this.#client = EagleClient
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
    askWithModal(inter, modal, time = 120) {
        inter.showModal(modal);
        return inter.awaitModalSubmit({
            filter: i => i.customId == modal.data.customId,
            time: time * 1000,
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
}

module.exports = { EagleFonctions }