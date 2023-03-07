import {
    ActionRowBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ChannelType, ChatInputCommandInteraction, ComponentType, EmbedBuilder,
    InteractionResponse, Message, ModalSubmitInteraction
} from "discord.js";
import { EagleClient } from "../structures/Client";

export default class Utils {
    #client: EagleClient;
    constructor(client: EagleClient) {
        this.#client = client;
    }

    pagination(Embed: EmbedBuilder, nameArray: string[], valueArray: string[], interaction: ChatInputCommandInteraction) {
        const nbrPage = Math.ceil(nameArray.length/25);
        let row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder().setCustomId("[no-check]pagination_previous").setStyle(ButtonStyle.Primary).setDisabled(true).setLabel("◀️"),
            new ButtonBuilder().setCustomId("[no-check]pagination_position").setStyle(ButtonStyle.Primary).setDisabled(true).setLabel(`1/${nbrPage}`),
            new ButtonBuilder().setCustomId("[no-check]pagination_next").setStyle(ButtonStyle.Primary).setDisabled(false).setLabel("▶️️"),
        );

        interaction.reply({
            embeds: [
                pagLoop(0, 25, Embed, nameArray, valueArray)
            ],
            components: [row],
            fetchReply: true
        }).then(message => {
            mainPag(message)
        })

        function mainPag(message) {
            pagWaitComponent(message)
            .then(inter => {
                const choix = inter.customId.replace('[no-check]pagination_',"");
                // @ts-ignore
                const position = inter.message.components[0].components[1].label.split("/");

                if (choix == "previous") {
                    var embed = pagLoop((Number(position[0])-2)*25, (Number(position[0])-2)*25 + 25, new EmbedBuilder(inter.message.embeds[0]), nameArray, valueArray);
                    if (Number(position[0]) <= 2) row.components[0].setDisabled(true);
                    row.components[2].setDisabled(false);
                    row.components[1].setLabel(`${Number(position[0]) - 1}/${position[1]}`)
                } else {
                    var embed = pagLoop((Number(position[0]))*25, (Number(position[0]))*25 + 25, new EmbedBuilder(inter.message.embeds[0]), nameArray, valueArray);
                    if (Number(position[0]) <= Number(position[1])-1) row.components[2].setDisabled(true);
                    row.components[0].setDisabled(false);
                    row.components[1].setLabel(`${Number(position[0]) + 1}/${position[1]}`)
                }
                inter.update({
                    embeds: [embed],
                    components: [row],
                    fetchReply: true
                }).then(message => mainPag(message))
                    .catch(console.log)
            })
            .catch(reason => {
                row.components.map(btn => btn.setDisabled(true))
                interaction.editReply({components: [row]})
            })
        }
        function pagWaitComponent(message: Message) {
            return new Promise((resolve: (value: ButtonInteraction) => void, reject) => {
                const collector = message.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    filter: i => i.customId.startsWith('[no-check]pagination'),
                    time: 30 * 1000,
                });
                collector.on("collect", inter => {
                    collector.stop("collected")
                    resolve(inter)
                })
                collector.on("end", (collected, reason) => {
                    if (reason == "collected")return;
                    reject(reason)
                })
            })
        }

        function pagLoop(start: number, end: number, embed: EmbedBuilder, nameArray: string[], valueArray: string[]) {
            let i = 0;
            embed.data.fields = [];
            while (start+i < end && start+i < nameArray.length) {
                embed.addFields({
                    name: `${start+i+1}. ${nameArray[start+i]}`,
                    value: valueArray[start+i],
                    inline: true
                })
                i++;
            }
            return embed;
        }
    }

    numberFormat(nbr: number) {
        return new Intl.NumberFormat("fr", {notation: "compact"}).format(nbr)
    }

    slashCommandSend(name: string, sub: string = "", subGroup: string = "") {
        return `</${name}${subGroup}${sub}:${this.#client.application.commands.cache.find(x => x.name == name).id}>`;
    }

    askWithButton(msg: Message, time = 30): Promise<ButtonInteraction | null> {
        return msg.awaitMessageComponent({
            componentType: ComponentType.Button,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
            .then(inter => {
                return inter
            })
            .catch(() => {
                // @ts-ignore
                msg.components.map(row => row.components.map(x => x.data.disabled = true));
                msg.edit({
                    components: msg.components
                });
                return null;
            })
    }

    askWithSelectMenuRole(msg, time = 30) {
        return msg.awaitMessageComponent({
            componentType: ComponentType.RoleSelect,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
            .then(inter => {
                return inter
            })
            .catch(() => {
                msg.components.map(row => row.components.map(x => x.data.disabled = true));
                msg.edit({
                    components: msg.components
                });
                return null
            })
    }

    askWithSelectMenuChannel(msg, time = 30) {
        return msg.awaitMessageComponent({
            componentType: ComponentType.ChannelSelect,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
            .then(inter => {
                return inter
            })
            .catch(() => {
                msg.components.map(row => row.components.map(x => x.data.disabled = true));
                msg.edit({
                    components: msg.components
                });
                return null
            })
    }

    askWithSelectMenuString(msg, time = 30) {
        return msg.awaitMessageComponent({
            componentType: ComponentType.StringSelect,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
            .then(inter => {
                return inter
            })
            .catch(() => {
                msg.components.map(row => row.components.map(x => x.data.disabled = true));
                msg.edit({
                    components: msg.components
                });
                return null
            })
    }

    askWithModal(inter, modal, time = 120): Promise<ModalSubmitInteraction | null> {
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
                inter.message.edit({
                    components: inter.message.components
                });
                return null
            })
    }

    desactivateAntiRaid(AntiRaidType: "anti-bot" | "anti-massChannel" | "anti-massRole" | "anti-massBan" | "anti-massUnban" | "anti-massKick" | "anti-massSticker" | "anti-massEmoji" |"anti-newAccount" | "anti-webhook" | "anti-admin", interaction: ChatInputCommandInteraction, value: {status: boolean, frequence?: string | null, ignoreWhitelist?: boolean, sanction?: String | null}, subGroup = null) {
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
                if (channel.type == ChannelType.GuildStageVoice || !channel.isTextBased()) return;
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
        }
    }

    activateAntiRaid(AntiRaidType, interaction: ChatInputCommandInteraction, value, subGroup = null) {
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
            if (channel.type == ChannelType.GuildStageVoice || !channel.isTextBased()) return;
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

    checkFrequence(stringTest: string, frequenceType: "x/yt") {
        let separator = frequenceType[1];
        const stringSplit = stringTest.split(separator);

        if (typeof Number(stringSplit[0]) != "number") return false;
        if (typeof Number(stringSplit[1].slice(0, stringSplit[1].length - 1)) != "number") return false;

        return true;
    };
}