"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Embed_1 = require("../../../structures/Enumerations/Embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("logs")
        .setDescription("Permet de définir les logs actifs pour ce serveur")
        .addChannelOption(opt => opt.setName('channel').setDescription("Le channel dans lequel sera envoyé les logs").addChannelTypes(discord_js_1.ChannelType.GuildText).setRequired(true)),
    execute(interaction, client) {
        let guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
        const logsName = Object.keys(guildData.logs);
        const channel = interaction.options.getChannel('channel');
        let paginationRow = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId("[no-check]logs#previous")
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setDisabled(true)
            .setLabel("⏪ Page précédente"), new discord_js_1.ButtonBuilder()
            .setCustomId("[no-check]logs")
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setDisabled(true)
            .setLabel("1/2"), new discord_js_1.ButtonBuilder()
            .setCustomId("[no-check]logs#next")
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setLabel("Page suivante ⏩"), new discord_js_1.ButtonBuilder()
            .setCustomId("[no-check]logs2")
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setDisabled(true)
            .setLabel("‎‎"), new discord_js_1.ButtonBuilder()
            .setCustomId("[no-check]logs#finish")
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setLabel("Terminer"));
        let logsRows = [new discord_js_1.ActionRowBuilder(), new discord_js_1.ActionRowBuilder(), new discord_js_1.ActionRowBuilder(), new discord_js_1.ActionRowBuilder(), new discord_js_1.ActionRowBuilder(), new discord_js_1.ActionRowBuilder(), new discord_js_1.ActionRowBuilder(), new discord_js_1.ActionRowBuilder(),];
        let j = [[], [], [], [], [], [], [], []];
        let i = 0;
        let k = 0;
        logsName.map(name => {
            k += name.length;
            logsRows[i].addComponents(btncolor(name, i));
            if (k > 48 || j[i].length == 5) {
                i++;
                k = 0;
            }
        });
        const logEmbed = new discord_js_1.EmbedBuilder()
            .setColor(Embed_1.DiscordColor.DarkBlue)
            .setTitle(`Modification des logs du serveur`)
            .setDescription(`**Channel:** <#${channel.id}>\n**Code couleur des boutons:** \n🟥 Log Inactive\n🟩 Log active dans le channel choisi\n🟦 Log active dans un autre channel.`);
        interaction.reply({
            embeds: [
                logEmbed
            ],
            components: [
                logsRows[0],
                logsRows[1],
                logsRows[2],
                logsRows[3],
                paginationRow
            ]
        }).then(msg => logMain(msg));
        function logMain(msg) {
            msg.awaitMessageComponent({
                time: 60 * 1000,
                filter: i => i.customId.startsWith("[no-check]logs") && i.user.id == interaction.user.id,
                componentType: discord_js_1.ComponentType.Button,
            })
                .then(inter => {
                const choix = inter.customId.split('#')[1];
                if (choix == "finish") {
                    interaction.fetchReply("@original").then(omsg => {
                        //@ts-ignore
                        omsg.components.map(r => r.components.map(b => b.data.disabled = true));
                        inter.update({
                            components: omsg.components
                        });
                    });
                }
                else if (choix == "next") {
                    paginationRow.components[0].setDisabled(false);
                    paginationRow.components[1].setLabel("2/2");
                    paginationRow.components[2].setDisabled(true);
                    inter.update({
                        components: [
                            logsRows[4],
                            logsRows[5],
                            logsRows[6],
                            logsRows[7],
                            paginationRow
                        ]
                    }).then(msg => logMain(msg));
                }
                else if (choix == "previous") {
                    paginationRow.components[0].setDisabled(true);
                    paginationRow.components[1].setLabel("1/2");
                    paginationRow.components[2].setDisabled(false);
                    inter.update({
                        components: [
                            logsRows[0],
                            logsRows[1],
                            logsRows[2],
                            logsRows[3],
                            paginationRow
                        ]
                    }).then(msg => logMain(msg));
                }
                else {
                    if (inter.component.style == discord_js_1.ButtonStyle.Success) {
                        guildData.logs[inter.component.label] = null;
                    }
                    else {
                        guildData.logs[inter.component.label] = channel.id;
                    }
                    ;
                    guildData.save();
                    logsRows[Number(choix)].components.find(x => x.data.label == inter.component.label).setStyle((guildData === null || guildData === void 0 ? void 0 : guildData.logs[inter.component.label]) ? guildData.logs[inter.component.label] == channel.id ? discord_js_1.ButtonStyle.Success : discord_js_1.ButtonStyle.Primary : discord_js_1.ButtonStyle.Danger);
                    if (Number(choix) < 4) {
                        inter.update({
                            components: [
                                logsRows[0],
                                logsRows[1],
                                logsRows[2],
                                logsRows[3],
                                paginationRow
                            ]
                        }).then(msg => logMain(msg));
                    }
                    else {
                        inter.update({
                            components: [
                                logsRows[4],
                                logsRows[5],
                                logsRows[6],
                                logsRows[7],
                                paginationRow
                            ]
                        }).then(msg => logMain(msg));
                    }
                }
            })
                .catch(() => {
                interaction.fetchReply("@original").then(omsg => {
                    //@ts-ignore
                    omsg.components.map(r => r.components.map(b => b.data.disabled = true));
                    interaction.editReply({
                        components: omsg.components
                    });
                });
            });
        }
        function btncolor(name, position) {
            checkChannel();
            return new discord_js_1.ButtonBuilder()
                .setLabel(name)
                .setStyle((guildData === null || guildData === void 0 ? void 0 : guildData.logs[name]) ? guildData.logs[name] == channel.id ? discord_js_1.ButtonStyle.Success : discord_js_1.ButtonStyle.Primary : discord_js_1.ButtonStyle.Danger)
                .setCustomId(`[no-check]logs_${name}#${position}`);
        }
        function checkChannel() {
            logsName.map(name => {
                if (interaction.guild.channels.cache.get(guildData.logs[name]))
                    return;
                guildData.logs[name] = null;
            });
            guildData.save();
        }
    }
};
