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
        .setName("help")
        .setDescription("Vous permet d'obtenir de l'aide sur les commandes")
        .setDMPermission(true)
        .addStringOption(opt => opt.setName("commande").setDescription(`La commande dont vous souhaitez recevoir de l'aide`).setAutocomplete(true)),
    autocomplete(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const focusedValue = interaction.options.getFocused();
            const choices = client.application.commands.cache.map(x => ({ name: x.name, description: x.description }));
            const filtered = choices.filter(choice => choice.name.startsWith(focusedValue) || choice.description.includes(focusedValue)).slice(0, 25);
            yield interaction.respond(filtered.map(choice => ({ name: `${choice.name} <----> ${choice.description}`, value: choice.name })));
        });
    },
    execute(interaction, client) {
        if (interaction.options.getString("commande")) {
            const command = client.application.commands.cache.find(x => x.name == interaction.options.getString("commande"));
            let description = `**Description :** ${command.description}\n` +
                `**Permissions :** \`${typeof client.managers.guildsManager.getIfExist(interaction.guildId).permissions[command.name] == "string" ? client.managers.guildsManager.getIfExist(interaction.guildId).permissions[command.name] : new discord_js_1.PermissionsBitField(BigInt(client.managers.guildsManager.getIfExist(interaction.guildId).permissions[command.name])).toArray()[0]}\`\n` +
                `**Utilisations :**\n` +
                `${client.func.utils.slashCommandSend(command.name)} ${command.options.filter(x => x.type != 1 && x.type != 2 && x.required).map(x => `\`{${x.name}}\``).join(" ")} ${command.options.filter(x => x.type != 1 && x.type != 2 && !x.required).map(x => `\`<${x.name}>\``).join(" ")}\n` +
                `\n{} Option Obligatoire | <> Option Optionnelle`;
            const helpEmbed = new discord_js_1.EmbedBuilder().setDescription(description).setTitle(`Aide sur la commande ${command.name}`).setFooter({ text: `Besoin de plus d'aide ? https://discord.gg/eaglebot` }).setColor("White");
            interaction.reply({
                embeds: [helpEmbed],
                ephemeral: true
            });
        }
        else {
            const folders = client._fs.readdirSync("./src/Interactions/SlashCommands");
            let SelectMenuHelp = new discord_js_1.StringSelectMenuBuilder()
                .setCustomId("[no-check]help")
                .setPlaceholder("Choississez une catégorie")
                .setMaxValues(1)
                .addOptions({
                label: "🏠 Accueil",
                value: "Accueil"
            });
            let nbrCommandsByCategory = {};
            folders.map(fold => {
                const commandNameArray = client._fs.readdirSync(`./src/Interactions/SlashCommands/${fold}`).map(file => {
                    return require(`../${fold}/${file}`).default.data.name;
                });
                nbrCommandsByCategory[fold] = client.application.commands.cache.filter(cmd => commandNameArray.includes(cmd.name)).map(cmd => {
                    let nbr = 0;
                    cmd === null || cmd === void 0 ? void 0 : cmd.options.map(opt => {
                        if (opt.type == 2) {
                            // @ts-ignore
                            if (opt === null || opt === void 0 ? void 0 : opt.options) {
                                // @ts-ignore
                                opt === null || opt === void 0 ? void 0 : opt.options.map(opt2 => {
                                    if (opt2.type == 1)
                                        nbr++;
                                });
                            }
                            else
                                nbr++;
                        }
                        else if (opt.type == 1)
                            nbr++;
                    });
                    if (nbr == 0)
                        nbr++;
                    return nbr;
                }).reduce((a, b) => a + b);
            });
            let acceuilEmbed = new discord_js_1.EmbedBuilder()
                .setColor("LightGrey")
                .setTitle("Menu d'aide pour les commandes")
                .setDescription(`
            **Voici les catégories de commandes :**
            ${folders.map(fold => `${fold} --> **${nbrCommandsByCategory[fold]} Commandes`).join("**\n")}**\n
            Nombre de commandes total: **${client.application.commands.cache.map(cmd => {
                let nbr = 0;
                cmd === null || cmd === void 0 ? void 0 : cmd.options.map(opt => {
                    if (opt.type == 2) {
                        // @ts-ignore
                        if (opt === null || opt === void 0 ? void 0 : opt.options) {
                            // @ts-ignore
                            opt === null || opt === void 0 ? void 0 : opt.options.map(opt2 => {
                                if (opt2.type == 1)
                                    nbr++;
                            });
                        }
                        else
                            nbr++;
                    }
                    else if (opt.type == 1)
                        nbr++;
                });
                if (nbr == 0)
                    nbr++;
                return nbr;
            }).reduce((a, b) => a + b)}**
            `)
                .setFooter({ text: "Eagle Bot", iconURL: "https://cdn.discordapp.com/icons/1067846719972323358/4fd19c96bc2efda9a40d4c58bc5e3158.webp?size=128" });
            for (let folder of folders) {
                SelectMenuHelp.addOptions({
                    label: folder,
                    value: folder,
                });
            }
            interaction.reply({
                embeds: [
                    acceuilEmbed
                ],
                components: [
                    new discord_js_1.ActionRowBuilder().addComponents(SelectMenuHelp)
                ],
                ephemeral: true
            })
                .then(msg => {
                askSelectMenu(msg);
            });
            function askSelectMenu(msg) {
                msg.awaitMessageComponent({
                    filter: i => i.customId == "[no-check]help",
                    componentType: discord_js_1.ComponentType.StringSelect,
                    time: 120 * 1000
                })
                    .then((inter) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b, _c, _d, _e;
                    if (inter.values[0] == "Accueil") {
                        var embedCommands = acceuilEmbed;
                    }
                    else {
                        const files = client._fs.readdirSync(`./src/Interactions/SlashCommands/${inter.values[0]}`);
                        var embedCommands = new discord_js_1.EmbedBuilder()
                            .setColor("Blue")
                            .setTitle(`Aide des commandes ${inter.values[0]}`);
                        var AllCommands = {};
                        var nbrAllSubOfAllCommands = 0;
                        for (let file of files) {
                            let nbrAllCommands = 0;
                            const path = require(`../${inter.values[0]}/${file}`).default;
                            const commands = client.application.commands.cache.find(cmd => cmd.name == path.data.name);
                            const subGroup_Object = {};
                            (_a = path.data) === null || _a === void 0 ? void 0 : _a.options.filter(opt => (opt === null || opt === void 0 ? void 0 : opt.toJSON().type) == 2).map(sub => {
                                var _a;
                                subGroup_Object[sub.name] = (_a = sub === null || sub === void 0 ? void 0 : sub.toJSON()) === null || _a === void 0 ? void 0 : _a.options.filter(opt => opt.type == 1).map(opt => { return { name: opt.name, description: opt.description }; });
                            });
                            const sub_Array = (_b = path.data) === null || _b === void 0 ? void 0 : _b.options.filter(opt => opt.toJSON().type == 1).map(opt => {
                                return {
                                    name: opt.toJSON().name,
                                    description: opt.toJSON().description
                                };
                            });
                            if (Object.keys(subGroup_Object).length != 0) {
                                for (let subGroup of Object.keys(subGroup_Object)) {
                                    if ((_c = subGroup_Object[subGroup]) === null || _c === void 0 ? void 0 : _c.length)
                                        nbrAllCommands += subGroup_Object[subGroup].length;
                                    else
                                        nbrAllCommands++;
                                }
                            }
                            if (sub_Array.length != 0)
                                nbrAllCommands += sub_Array.length;
                            if (Object.keys(subGroup_Object).length == 0 && sub_Array.length == 0)
                                nbrAllCommands++;
                            AllCommands[`${commands.name}`] = {
                                description: path.data.description,
                                subGroup: Object.keys(subGroup_Object).length == 0 ? null : subGroup_Object,
                                sub: sub_Array.length == 0 ? null : sub_Array,
                                commandsSize: nbrAllCommands,
                            };
                            nbrAllSubOfAllCommands += nbrAllCommands;
                        }
                        for (let commandName in AllCommands) {
                            const commandData = AllCommands[commandName];
                            if (((_e = (_d = embedCommands === null || embedCommands === void 0 ? void 0 : embedCommands.data) === null || _d === void 0 ? void 0 : _d.fields) === null || _e === void 0 ? void 0 : _e.length) + commandData.commandsSize > 24)
                                break;
                            const command = client.application.commands.cache.find(cmd => cmd.name == commandName);
                            if (commandData.subGroup) {
                                for (const subGroupName in commandData.subGroup) {
                                    const subGroupData = commandData.subGroup[subGroupName];
                                    if (subGroupData.length > 0) {
                                        for (const sub of subGroupData) {
                                            embedCommands.addFields({
                                                name: `</${commandName} ${subGroupName} ${sub.name}:${command.id}>`,
                                                value: `${sub.description}`
                                            });
                                        }
                                        ;
                                    }
                                    else {
                                        embedCommands.addFields({
                                            name: `</${commandName} ${subGroupName}:${command.id}>`,
                                            value: `${subGroupData.description}`
                                        });
                                    }
                                    ;
                                }
                                ;
                            }
                            ;
                            if (commandData.sub) {
                                for (const sub of commandData.sub) {
                                    embedCommands.addFields({
                                        name: `</${commandName} ${sub.name}:${command.id}>`,
                                        value: `${sub.description}`
                                    });
                                }
                                ;
                            }
                            ;
                            if (!commandData.subGroup && !commandData.sub) {
                                embedCommands.addFields({
                                    name: `</${commandName}:${command.id}>`,
                                    value: `${commandData.description}`
                                });
                            }
                            ;
                        }
                        if (nbrAllSubOfAllCommands > 25) {
                            let p = [];
                            Object.values(AllCommands).map(cmd => cmd.commandsSize).reduce((a, b, i) => {
                                if (a + b > 25) {
                                    p.push(i);
                                    return b;
                                }
                                else
                                    return a + b;
                            });
                            var rowPagination = new discord_js_1.ActionRowBuilder()
                                .addComponents(new discord_js_1.ButtonBuilder()
                                .setCustomId("[no-check]Previous")
                                .setDisabled(true)
                                .setEmoji("◀️")
                                .setStyle(1), new discord_js_1.ButtonBuilder()
                                .setCustomId("[no-check]")
                                .setDisabled(true)
                                .setLabel(`1/${p.length + 1}`)
                                .setStyle(1), new discord_js_1.ButtonBuilder()
                                .setCustomId("[no-check]Next")
                                .setDisabled(false)
                                .setEmoji("▶️")
                                .setStyle(1));
                        }
                    }
                    if (nbrAllSubOfAllCommands > 25) {
                        inter.update({
                            embeds: [embedCommands],
                            components: [
                                new discord_js_1.ActionRowBuilder().addComponents(SelectMenuHelp),
                                rowPagination
                            ]
                        }).then(msg => {
                            askSelectMenu(msg);
                            askPagination(msg, embedCommands, AllCommands, nbrAllSubOfAllCommands, embedCommands, rowPagination);
                        });
                    }
                    else {
                        inter.update({
                            embeds: [embedCommands], components: [new discord_js_1.ActionRowBuilder().addComponents(SelectMenuHelp)],
                        }).then(msg => {
                            askSelectMenu(msg);
                        });
                    }
                }))
                    .catch((err) => {
                    interaction.editReply({
                        components: [
                            new discord_js_1.ActionRowBuilder().addComponents(SelectMenuHelp.setDisabled(true))
                        ],
                    });
                });
            }
            function askPagination(msg, commandsEmbed, AllCommands, nbrAllSubOfAllCommands, embedCommands, rowPagination) {
                msg.awaitMessageComponent({
                    filter: i => i.customId.startsWith("[no-check]") && i.message.embeds[0].data.title.split(" ")[4] == commandsEmbed.data.title.split(" ")[4],
                    componentType: discord_js_1.ComponentType.Button,
                    time: 30 * 1000
                })
                    .then(inter => {
                    const reponse = inter.customId.replace("[no-check]", "");
                    const position = inter.message.components[1].components[1].label.split("/");
                    let Embed = commandsEmbed;
                    Embed.setFields();
                    switch (reponse) {
                        case "Previous":
                            {
                                let i = (Number(position[0]) - 1) * 25 - 1;
                                let j = (Number(position[0]) - 1) * 25 - 25;
                                let p = [];
                                Object.values(AllCommands).map(cmd => cmd.commandsSize).reduce((a, b, i) => {
                                    if (a + b > 25) {
                                        p.push(i);
                                        return b;
                                    }
                                    else
                                        return a + b;
                                });
                                let min = p[position[0] - 3] || 0;
                                let max = p[position[0] - 2] || Object.keys(AllCommands).length;
                                let k = min;
                                while (j <= i && k < max) {
                                    let commandName = Object.keys(AllCommands)[k];
                                    const commandData = AllCommands[commandName];
                                    const command = client.application.commands.cache.find(cmd => cmd.name == commandName);
                                    if (commandData.subGroup) {
                                        for (const subGroupName in commandData.subGroup) {
                                            const subGroupData = commandData.subGroup[subGroupName];
                                            if (subGroupData.length > 0) {
                                                for (const sub of subGroupData) {
                                                    embedCommands.addFields({
                                                        name: `</${commandName} ${subGroupName} ${sub.name}:${command.id}>`,
                                                        value: `${sub.description}`
                                                    });
                                                }
                                                ;
                                            }
                                            else {
                                                embedCommands.addFields({
                                                    name: `</${commandName} ${subGroupName}:${command.id}>`,
                                                    value: `${subGroupData.description}`
                                                });
                                            }
                                            ;
                                        }
                                        ;
                                    }
                                    ;
                                    if (commandData.sub) {
                                        for (const sub of commandData.sub) {
                                            embedCommands.addFields({
                                                name: `</${commandName} ${sub.name}:${command.id}>`,
                                                value: `${sub.description}`
                                            });
                                        }
                                        ;
                                    }
                                    ;
                                    if (!commandData.subGroup && !commandData.sub) {
                                        embedCommands.addFields({
                                            name: `</${commandName}:${command.id}>`,
                                            value: `${commandData.description}`
                                        });
                                    }
                                    ;
                                    j++;
                                    k++;
                                }
                                if (Number(position[0]) - 1 == 1) {
                                    rowPagination.components[0].setDisabled(true);
                                }
                                rowPagination.components[2].setDisabled(false);
                                rowPagination.components[1].setLabel(`${Number(position[0]) - 1}/${position[1]}`);
                                inter.update({
                                    embeds: [
                                        Embed
                                    ],
                                    components: [
                                        inter.message.components[0],
                                        rowPagination
                                    ]
                                }).then(msg => {
                                    askPagination(msg, Embed, AllCommands, nbrAllSubOfAllCommands, embedCommands, rowPagination);
                                });
                            }
                            break;
                        case "Next":
                            {
                                let i = Number(position[0]) * 25 + 24;
                                let j = Number(position[0]) * 25;
                                let p = [];
                                Object.values(AllCommands).map(cmd => cmd.commandsSize).reduce((a, b, i) => {
                                    if (a + b > 25) {
                                        p.push(i);
                                        return b;
                                    }
                                    else
                                        return a + b;
                                });
                                let min = p[position[0] - 1];
                                let max = p[position[0]] || Object.keys(AllCommands).length;
                                let k = min;
                                while (j <= i && k < max) {
                                    let commandName = Object.keys(AllCommands)[k];
                                    const commandData = AllCommands[commandName];
                                    const command = client.application.commands.cache.find(cmd => cmd.name == commandName);
                                    if (commandData.subGroup) {
                                        for (const subGroupName in commandData.subGroup) {
                                            const subGroupData = commandData.subGroup[subGroupName];
                                            if (subGroupData.length > 0) {
                                                for (const sub of subGroupData) {
                                                    embedCommands.addFields({
                                                        name: `</${commandName} ${subGroupName} ${sub.name}:${command.id}>`,
                                                        value: `${sub.description}`
                                                    });
                                                }
                                                ;
                                            }
                                            else {
                                                embedCommands.addFields({
                                                    name: `</${commandName} ${subGroupName}:${command.id}>`,
                                                    value: `${subGroupData.description}`
                                                });
                                            }
                                            ;
                                        }
                                        ;
                                    }
                                    ;
                                    if (commandData.sub) {
                                        for (const sub of commandData.sub) {
                                            embedCommands.addFields({
                                                name: `</${commandName} ${sub.name}:${command.id}>`,
                                                value: `${sub.description}`
                                            });
                                        }
                                        ;
                                    }
                                    ;
                                    if (!commandData.subGroup && !commandData.sub) {
                                        embedCommands.addFields({
                                            name: `</${commandName}:${command.id}>`,
                                            value: `${commandData.description}`
                                        });
                                    }
                                    ;
                                    j++;
                                    k++;
                                }
                                if (Number(position[0]) + 1 == position[1]) {
                                    rowPagination.components[2].setDisabled(true);
                                }
                                rowPagination.components[0].setDisabled(false);
                                rowPagination.components[1].setLabel(`${Number(position[0]) + 1}/${position[1]}`);
                                inter.update({
                                    embeds: [
                                        Embed
                                    ],
                                    components: [
                                        inter.message.components[0],
                                        rowPagination
                                    ]
                                }).then(msg => {
                                    askPagination(msg, Embed, AllCommands, nbrAllSubOfAllCommands, embedCommands, rowPagination);
                                });
                            }
                            break;
                    }
                })
                    .catch((err) => {
                    try {
                        interaction.editReply({
                            components: [
                                new discord_js_1.ActionRowBuilder().addComponents(SelectMenuHelp),
                            ],
                        });
                    }
                    catch (_a) { }
                });
            }
        }
    }
};
