"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("autoroles")
        .setDMPermission(false)
        .setDescription("Permet de définir quels rôles seront ajoutés automatiquement"),
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
            mainAutoRoles(message);
        });
        function mainAutoRoles(message) {
            client.func.utils.askWithButton(message)
                .then(inter => {
                var _a, _b, _c;
                if (!inter)
                    return;
                switch (inter.customId.replace("[no-check]autoroles-", "")) {
                    case "addrole": {
                        return inter.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setTitle("autoroles Ping | Ajout de role")
                                    .setDescription("Vous pouvez ajouter jusqu'à 15 roles aux maximum !")
                                    .setFooter({ text: "Vous avez 2 minutes pour choisir vos roles" })
                                    .setColor("Gold")
                            ],
                            components: [
                                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.RoleSelectMenuBuilder()
                                    .setCustomId("[no-check]autoroles-addrole")
                                    .setMinValues(1)
                                    .setMaxValues(15 - (((_a = guildData.autoroles) === null || _a === void 0 ? void 0 : _a.length) || 0)))
                            ]
                        })
                            .then(message => {
                            return client.func.utils.askWithSelectMenuRole(message, 120)
                                .then(inter2 => {
                                var _a;
                                if (!inter2)
                                    return;
                                (_a = guildData.autoroles) === null || _a === void 0 ? void 0 : _a.push(...inter2.values);
                                guildData.save();
                                inter2.message.delete();
                                return interaction.editReply({
                                    embeds: [
                                        createEmbed()
                                    ],
                                    components: [
                                        createRow()
                                    ]
                                }).then(mainAutoRoles);
                            });
                        });
                    }
                    case "removerole": {
                        return inter.reply({
                            embeds: [
                                new discord_js_1.EmbedBuilder()
                                    .setTitle("autoroles Ping | Suppression de role")
                                    .setFooter({ text: "Vous avez 2 minutes pour choisir vos roles" })
                                    .setColor("Gold")
                            ],
                            components: [
                                new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
                                    .setCustomId("[no-check]autoroles-removerole")
                                    .addOptions((_b = guildData.autoroles) === null || _b === void 0 ? void 0 : _b.map(roleId => {
                                    return {
                                        label: interaction.guild.roles.cache.get(roleId).name,
                                        value: roleId,
                                    };
                                }))
                                    .setMinValues(1)
                                    .setMaxValues(((_c = guildData.autoroles) === null || _c === void 0 ? void 0 : _c.length) || 0))
                            ]
                        })
                            .then(message => {
                            return client.func.utils.askWithSelectMenuString(message, 120)
                                .then(inter2 => {
                                var _a;
                                if (!inter2)
                                    return;
                                guildData.autoroles = (_a = guildData.autoroles) === null || _a === void 0 ? void 0 : _a.filter(m => !inter2.values.includes(m));
                                guildData.save();
                                inter2.message.delete();
                                return interaction.editReply({
                                    embeds: [
                                        createEmbed()
                                    ],
                                    components: [
                                        createRow()
                                    ]
                                }).then(mainAutoRoles);
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
            var _a, _b;
            return new discord_js_1.EmbedBuilder()
                .setTitle("Gestion des auto roles pour les arrivants")
                .setDescription("Les 'autoroles' sont des roles qui sont donnés automatiquement à un membre lorse qu'il rejoint.")
                .addFields({
                name: "Status",
                value: ((_a = guildData.autoroles) === null || _a === void 0 ? void 0 : _a.length) > 0 ? "``Actif``" : "``Inactif``"
            }, {
                name: "Roles",
                value: ((_b = guildData.autoroles) === null || _b === void 0 ? void 0 : _b.map(c => `<@&${c}>`).join("\n")) || "Aucun Roles"
            })
                .setColor("Blurple");
        }
        function createRow() {
            var _a, _b;
            let autorolesRow = new discord_js_1.ActionRowBuilder();
            if (((_a = guildData.autoroles) === null || _a === void 0 ? void 0 : _a.length) >= 15) {
                autorolesRow.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]autoroles-addrole")
                    .setLabel("Ajouter un role")
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setDisabled(true));
            }
            else {
                autorolesRow.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]autoroles-addrole")
                    .setLabel("Ajouter un role")
                    .setStyle(discord_js_1.ButtonStyle.Primary));
            }
            if (((_b = guildData.autoroles) === null || _b === void 0 ? void 0 : _b.length) == 0) {
                autorolesRow.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]autoroles-removerole")
                    .setLabel("Retirer un role")
                    .setStyle(discord_js_1.ButtonStyle.Secondary)
                    .setDisabled(true));
            }
            else {
                autorolesRow.addComponents(new discord_js_1.ButtonBuilder()
                    .setCustomId("[no-check]autoroles-removerole")
                    .setLabel("Retirer un role")
                    .setStyle(discord_js_1.ButtonStyle.Secondary));
            }
            autorolesRow.addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId("[no-check]autoroles-end")
                .setStyle(discord_js_1.ButtonStyle.Success)
                .setLabel("Terminer"));
            return autorolesRow;
        }
    }
};
