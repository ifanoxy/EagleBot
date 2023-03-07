"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("greet-ping")
        .setDescription("Permet de ping un membre lorse qu'il rejoint")
        .setDMPermission(false),
    execute(interaction, client) {
        let guildData = client.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
        interaction.reply({
            embeds: [
                createEmbed()
            ],
            components: [
                createRow()
            ],
            fetchReply: true
        }).then(message => {
            mainGreetPing(message);
        });
        function mainGreetPing(message) {
            client.func.utils.askWithButton(message)
                .then(inter => {
                var _a, _b;
                if (!inter)
                    return;
                switch (inter.customId.replace("[no-check]greet-", "")) {
                    case "desactivate": {
                        guildData.greetPing.status = false;
                        guildData.save();
                        return inter.update({
                            embeds: [
                                createEmbed()
                            ],
                            components: [
                                createRow()
                            ]
                        }).then(mainGreetPing);
                    }
                    case "activate": {
                        guildData.greetPing.status = true;
                        guildData.save();
                        return inter.update({
                            embeds: [
                                createEmbed()
                            ],
                            components: [
                                createRow()
                            ]
                        }).then(mainGreetPing);
                    }
                    case "addchannel": {
                        return inter.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setTitle("Greet Ping | Ajout de Channel")
                                    .setDescription("Vous pouvez ajouter jusqu'à 15 channels aux maximum !")
                                    .setFooter({ text: "Vous avez 2 minutes pour choisir vos channels" })
                                    .setColor("Gold")
                            ],
                            components: [
                                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ChannelSelectMenuBuilder()
                                    .setChannelTypes([discord_js_1.ChannelType.GuildText, discord_js_1.ChannelType.GuildAnnouncement])
                                    .setCustomId("[no-check]greet-addchannel")
                                    .setMinValues(1)
                                    .setMaxValues(15 - ((_a = guildData.greetPing.channels) === null || _a === void 0 ? void 0 : _a.length)))
                            ]
                        })
                            .then(message => {
                            return client.func.utils.askWithSelectMenuChannel(message, 120)
                                .then(inter2 => {
                                var _a;
                                if (!inter2)
                                    return;
                                (_a = guildData.greetPing.channels) === null || _a === void 0 ? void 0 : _a.push(...inter2.values);
                                guildData.save();
                                inter2.message.delete();
                                return interaction.editReply({
                                    embeds: [
                                        createEmbed()
                                    ],
                                    components: [
                                        createRow()
                                    ]
                                }).then(mainGreetPing);
                            });
                        });
                    }
                    case "removechannel": {
                        return inter.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setTitle("Greet Ping | Suppression de Channel")
                                    .setFooter({ text: "Vous avez 2 minutes pour choisir vos channels" })
                                    .setColor("Gold")
                            ],
                            components: [
                                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
                                    .setCustomId("[no-check]greet-removechannel")
                                    .addOptions(guildData.greetPing.channels.map(channelId => {
                                    return {
                                        label: interaction.guild.channels.cache.get(channelId).name,
                                        value: channelId,
                                    };
                                }))
                                    .setMinValues(1)
                                    .setMaxValues((_b = guildData.greetPing.channels) === null || _b === void 0 ? void 0 : _b.length))
                            ]
                        })
                            .then(message => {
                            return client.func.utils.askWithSelectMenuString(message, 120)
                                .then(inter2 => {
                                var _a, _b;
                                if (!inter2)
                                    return;
                                guildData.greetPing.channels = (_b = (_a = guildData.greetPing) === null || _a === void 0 ? void 0 : _a.channels) === null || _b === void 0 ? void 0 : _b.filter(m => !inter2.values.includes(m));
                                guildData.save();
                                inter2.message.delete();
                                return interaction.editReply({
                                    embeds: [
                                        createEmbed()
                                    ],
                                    components: [
                                        createRow()
                                    ]
                                }).then(mainGreetPing);
                            });
                        });
                    }
                    case "end": {
                        return inter.update({
                            embeds: [
                                createEmbed().setColor("Green")
                            ],
                            components: []
                        });
                    }
                }
            });
        }
        function createEmbed() {
            var _a, _b, _c;
            return new discord_js_1.EmbedBuilder()
                .setTitle("Gestion des notifications automatiques pour les arrivants")
                .setDescription("Les 'greet-ping' sont des notifications qui sont envoyé dans des channels prédéfinis et qui sont supprimés 2 secondes après.")
                .addFields({
                name: "Status",
                value: ((_a = guildData.greetPing) === null || _a === void 0 ? void 0 : _a.status) ? "``Actif``" : "``Inactif``"
            }, {
                name: "Channel",
                value: ((_c = (_b = guildData.greetPing) === null || _b === void 0 ? void 0 : _b.channels) === null || _c === void 0 ? void 0 : _c.map(c => `<#${c}>`).join("\n")) || "Aucun Channel"
            })
                .setColor("Blurple");
        }
        function createRow() {
            var _a, _b, _c;
            let greetRow = new discord_js_1.ActionRowBuilder();
            if ((_a = guildData.greetPing) === null || _a === void 0 ? void 0 : _a.status) {
                greetRow.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]greet-desactivate")
                    .setLabel("Désactiver")
                    .setStyle(discord_js_1.ButtonStyle.Danger));
            }
            else {
                greetRow.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]greet-activate")
                    .setLabel("Activer")
                    .setStyle(discord_js_1.ButtonStyle.Success));
            }
            if (((_b = guildData === null || guildData === void 0 ? void 0 : guildData.greetPing.channels) === null || _b === void 0 ? void 0 : _b.length) >= 15) {
                greetRow.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]greet-addchannel")
                    .setLabel("Ajouter un channel")
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setDisabled(true));
            }
            else {
                greetRow.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]greet-addchannel")
                    .setLabel("Ajouter un channel")
                    .setStyle(discord_js_1.ButtonStyle.Primary));
            }
            if (((_c = guildData === null || guildData === void 0 ? void 0 : guildData.greetPing.channels) === null || _c === void 0 ? void 0 : _c.length) == 0) {
                greetRow.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]greet-removechannel")
                    .setLabel("Retirer un channel")
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setDisabled(true));
            }
            else {
                greetRow.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]greet-removechannel")
                    .setLabel("Retirer un channel")
                    .setStyle(discord_js_1.ButtonStyle.Secondary));
            }
            greetRow.addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId("[no-check]greet-end")
                .setStyle(discord_js_1.ButtonStyle.Success)
                .setLabel("Terminer"));
            return greetRow;
        }
    }
};
