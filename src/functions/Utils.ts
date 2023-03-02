import {ActionRowBuilder, ButtonBuilder,
    ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, ComponentType, EmbedBuilder,
    InteractionResponse, Message } from "discord.js";
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

    askWithButton(msg, time = 30) {
        return msg.awaitMessageComponent({
            componentType: ComponentType.Button,
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
}