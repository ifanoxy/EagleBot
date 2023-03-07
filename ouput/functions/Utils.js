"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Utils_client;
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class Utils {
    constructor(client) {
        _Utils_client.set(this, void 0);
        __classPrivateFieldSet(this, _Utils_client, client, "f");
    }
    pagination(Embed, nameArray, valueArray, interaction) {
        const nbrPage = Math.ceil(nameArray.length / 25);
        let row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder().setCustomId("[no-check]pagination_previous").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(true).setLabel("◀️"), new discord_js_1.ButtonBuilder().setCustomId("[no-check]pagination_position").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(true).setLabel(`1/${nbrPage}`), new discord_js_1.ButtonBuilder().setCustomId("[no-check]pagination_next").setStyle(discord_js_1.ButtonStyle.Primary).setDisabled(false).setLabel("▶️️"));
        interaction.reply({
            embeds: [
                pagLoop(0, 25, Embed, nameArray, valueArray)
            ],
            components: [row],
            fetchReply: true
        }).then(message => {
            mainPag(message);
        });
        function mainPag(message) {
            pagWaitComponent(message)
                .then(inter => {
                const choix = inter.customId.replace('[no-check]pagination_', "");
                // @ts-ignore
                const position = inter.message.components[0].components[1].label.split("/");
                if (choix == "previous") {
                    var embed = pagLoop((Number(position[0]) - 2) * 25, (Number(position[0]) - 2) * 25 + 25, new discord_js_1.EmbedBuilder(inter.message.embeds[0]), nameArray, valueArray);
                    if (Number(position[0]) <= 2)
                        row.components[0].setDisabled(true);
                    row.components[2].setDisabled(false);
                    row.components[1].setLabel(`${Number(position[0]) - 1}/${position[1]}`);
                }
                else {
                    var embed = pagLoop((Number(position[0])) * 25, (Number(position[0])) * 25 + 25, new discord_js_1.EmbedBuilder(inter.message.embeds[0]), nameArray, valueArray);
                    if (Number(position[0]) <= Number(position[1]) - 1)
                        row.components[2].setDisabled(true);
                    row.components[0].setDisabled(false);
                    row.components[1].setLabel(`${Number(position[0]) + 1}/${position[1]}`);
                }
                inter.update({
                    embeds: [embed],
                    components: [row],
                    fetchReply: true
                }).then(message => mainPag(message))
                    .catch(console.log);
            })
                .catch(reason => {
                row.components.map(btn => btn.setDisabled(true));
                interaction.editReply({ components: [row] });
            });
        }
        function pagWaitComponent(message) {
            return new Promise((resolve, reject) => {
                const collector = message.createMessageComponentCollector({
                    componentType: discord_js_1.ComponentType.Button,
                    filter: i => i.customId.startsWith('[no-check]pagination'),
                    time: 30 * 1000,
                });
                collector.on("collect", inter => {
                    collector.stop("collected");
                    resolve(inter);
                });
                collector.on("end", (collected, reason) => {
                    if (reason == "collected")
                        return;
                    reject(reason);
                });
            });
        }
        function pagLoop(start, end, embed, nameArray, valueArray) {
            let i = 0;
            embed.data.fields = [];
            while (start + i < end && start + i < nameArray.length) {
                embed.addFields({
                    name: `${start + i + 1}. ${nameArray[start + i]}`,
                    value: valueArray[start + i],
                    inline: true
                });
                i++;
            }
            return embed;
        }
    }
    numberFormat(nbr) {
        return new Intl.NumberFormat("fr", { notation: "compact" }).format(nbr);
    }
    slashCommandSend(name, sub = "", subGroup = "") {
        return `</${name}${subGroup}${sub}:${__classPrivateFieldGet(this, _Utils_client, "f").application.commands.cache.find(x => x.name == name).id}>`;
    }
    askWithButton(msg, time = 30) {
        return msg.awaitMessageComponent({
            componentType: discord_js_1.ComponentType.Button,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
            .then(inter => {
            return inter;
        })
            .catch(() => {
            // @ts-ignore
            msg.components.map(row => row.components.map(x => x.data.disabled = true));
            msg.edit({
                components: msg.components
            });
            return null;
        });
    }
    askWithSelectMenuRole(msg, time = 30) {
        return msg.awaitMessageComponent({
            componentType: discord_js_1.ComponentType.RoleSelect,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
            .then(inter => {
            return inter;
        })
            .catch(() => {
            msg.components.map(row => row.components.map(x => x.data.disabled = true));
            msg.edit({
                components: msg.components
            });
            return null;
        });
    }
    askWithSelectMenuChannel(msg, time = 30) {
        return msg.awaitMessageComponent({
            componentType: discord_js_1.ComponentType.ChannelSelect,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
            .then(inter => {
            return inter;
        })
            .catch(() => {
            msg.components.map(row => row.components.map(x => x.data.disabled = true));
            msg.edit({
                components: msg.components
            });
            return null;
        });
    }
    askWithSelectMenuString(msg, time = 30) {
        return msg.awaitMessageComponent({
            componentType: discord_js_1.ComponentType.StringSelect,
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000
        })
            .then(inter => {
            return inter;
        })
            .catch(() => {
            msg.components.map(row => row.components.map(x => x.data.disabled = true));
            msg.edit({
                components: msg.components
            });
            return null;
        });
    }
    askWithModal(inter, modal, time = 120) {
        inter.showModal(modal);
        return inter.awaitModalSubmit({
            filter: i => i.customId.startsWith("[no-check]"),
            time: time * 1000,
        })
            .then(inter => {
            return inter;
        })
            .catch(() => {
            inter.message.components.map(row => row.components.map(cp => cp.disabled = true));
            inter.message.edit({
                components: inter.message.components
            });
            return null;
        });
    }
    desactivateAntiRaid(AntiRaidType, interaction, value, subGroup = null) {
        if (!interaction)
            throw new Error("Vous devez définir l'interaction");
        let database = __classPrivateFieldGet(this, _Utils_client, "f").managers.antiraidManager.getIfExist(interaction.guildId);
        if (database) {
            if (subGroup)
                database.status[AntiRaidType][subGroup] = value;
            else
                database.status[AntiRaidType] = value;
            database.save();
            if (database.log) {
                const channel = interaction.guild.channels.cache.get(database.log);
                if (!channel)
                    return database.log = null;
                if (channel.type == discord_js_1.ChannelType.GuildStageVoice || !channel.isTextBased())
                    return;
                channel.send({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setAuthor({ name: "Protect Logs" })
                            .setColor("#2f3136")
                            .setTitle(`Désactivation de l'${AntiRaidType} ${subGroup || ""}`)
                            .setDescription(`Action effectuer par <@${interaction.user.id}> (${interaction.user.id})`)
                            .setThumbnail("https://img.icons8.com/stickers/128/close-window.png")
                            .setTimestamp()
                    ]
                });
            }
        }
    }
    activateAntiRaid(AntiRaidType, interaction, value, subGroup = null) {
        if (!interaction)
            throw new Error("Vous devez définir l'interaction");
        let database = __classPrivateFieldGet(this, _Utils_client, "f").managers.antiraidManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
        if (subGroup)
            database.status[AntiRaidType][subGroup] = value;
        else
            database.status[AntiRaidType] = value;
        database.save();
        if (database.log) {
            const channel = interaction.guild.channels.cache.get(database.log);
            if (!channel)
                return database.log = null;
            if (channel.type == discord_js_1.ChannelType.GuildStageVoice || !channel.isTextBased())
                return;
            channel.send({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("#2f3136")
                        .setAuthor({ name: "Protect Logs" })
                        .setTitle(`Activation de l'${AntiRaidType} ${subGroup || ""}`)
                        .setDescription(`Action effectuer par <@${interaction.user.id}> (${interaction.user.id})`)
                        .setThumbnail("https://img.icons8.com/stickers/128/checked-2.png")
                        .setTimestamp()
                ]
            });
        }
    }
    ;
    checkFrequence(stringTest, frequenceType) {
        let separator = frequenceType[1];
        const stringSplit = stringTest.split(separator);
        if (typeof Number(stringSplit[0]) != "number")
            return false;
        if (typeof Number(stringSplit[1].slice(0, stringSplit[1].length - 1)) != "number")
            return false;
        return true;
    }
    ;
}
exports.default = Utils;
_Utils_client = new WeakMap();
