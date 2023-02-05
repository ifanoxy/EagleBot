const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType, ButtonBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Vous permet d'obtenir de l'aide sur les commandes")
    .setDMPermission(true),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        const folders = client._fs.readdirSync("./SlashCommands")
        let SelectMenuHelp = new StringSelectMenuBuilder()
        .setCustomId("[no-check]help")
        .setPlaceholder("Choississez une catégorie")
        .setMaxValues(1)
        .addOptions(
            {
                label: "🏠 Accueil",
                value: "Accueil"
            }
        )

        let nbrCommandsByCategory = {}
        folders.map(fold => {
            const commandNameArray = client._fs.readdirSync(`./SlashCommands/${fold}`).map(file => {
                return require(`../${fold}/${file}`).data.name
            })
            nbrCommandsByCategory[fold] = client.application.commands.cache.filter(cmd => commandNameArray.includes(cmd.name)).map(cmd => {
                let nbr = 0;
                cmd?.options.map(opt => {
                    if (opt.type == 2) {
                        if (opt.options) {
                            opt.options.map(opt2 => {
                                if (opt2.type == 1)nbr++;
                            })
                        } else nbr++;
                    } else if (opt.type == 1) nbr++
                })
                if (nbr == 0)nbr++;
                return nbr
            }).reduce((a, b) => a+b)
        });

        let acceuilEmbed = new EmbedBuilder()
            .setColor("LightGrey")
            .setTitle("Menu d'aide pour les commandes")
            .setDescription(`
            **Voici les catégories de commandes :**

            ${folders.map(fold => `${fold} --> **${nbrCommandsByCategory[fold]} Commandes`).join("**\n")}**

            Nombre de commandes total: **${client.application.commands.cache.map(cmd => {
                let nbr = 0;
                cmd?.options.map(opt => {
                    if (opt.type == 2) {
                        if (opt.options) {
                            opt.options.map(opt2 => {
                                if (opt2.type == 1)nbr++;
                            })
                        } else nbr++;
                    } else if (opt.type == 1) nbr++
                })
                if (nbr == 0)nbr++;
                return nbr
            }).reduce((a, b) => a+b)}**
            `)
            .setFooter({text: "Eagle Bot", iconURL: "https://cdn.discordapp.com/icons/1067846719972323358/4fd19c96bc2efda9a40d4c58bc5e3158.webp?size=128"})
        
        for (let folder of folders) {
            SelectMenuHelp.addOptions(
                {
                    label: folder,
                    value: folder,
                }
            )
        }

        interaction.reply({
            embeds: [
                acceuilEmbed
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    SelectMenuHelp
                )
            ],
            ephemeral: true
        })
        .then(msg => {
            askSelectMenu(msg)
        })

        function askSelectMenu(msg) {
            msg.awaitMessageComponent({
                filter: i => i.customId == "[no-check]help",
                componentType: ComponentType.StringSelect,
                time: 120 * 1000
            })
            .then(async inter => {
                if (inter.values[0] == "Accueil") {
                    var embedCommands = acceuilEmbed
                } else {
                    const files = client._fs.readdirSync(`SlashCommands/${inter.values[0]}`)
                    var embedCommands = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle(`Aide des commandes ${inter.values[0]}`)
    
                    var AllCommands = {}
                    var nbrAllSubOfAllCommands = 0;

                    for (let file of files) {
                        let nbrAllCommands = 0;
                        const path = require(`../${inter.values[0]}/${file}`)
                        const commands = client.application.commands.cache.find(cmd => cmd.name == path.data.name);
                        const subGroup_Object = {}
                        path.data?.options.filter(opt => opt?.toJSON().type == 2).map(sub => {
                            subGroup_Object[sub.name] = sub?.toJSON()?.options.filter(opt => opt.type == 1).map(opt => {return {name: opt.name, description: opt.description}})
                        })
                        const sub_Array = path.data?.options.filter(opt => opt.toJSON().type == 1).map(opt => {
                            return {
                                name: opt.toJSON().name,
                                description: opt.toJSON().description
                            }
                        })

                        if (Object.keys(subGroup_Object).length != 0) {
                            for (let subGroup of Object.keys(subGroup_Object)) {
                                if (subGroup_Object[subGroup]?.length)nbrAllCommands += subGroup_Object[subGroup].length;
                                else nbrAllCommands++;
                            }
                        }
                        if (sub_Array.length != 0) nbrAllCommands += sub_Array.length;
                        if (Object.keys(subGroup_Object).length == 0 && sub_Array.length == 0)nbrAllCommands++;
                        
                        AllCommands[`${commands.name}`] = {
                            description: path.data.description,
                            subGroup: Object.keys(subGroup_Object).length == 0 ? null : subGroup_Object,
                            sub: sub_Array.length == 0 ? null : sub_Array,
                            commandsSize: nbrAllCommands,
                        }

                        nbrAllSubOfAllCommands += nbrAllCommands;
                    }

                    for (let commandName in AllCommands) {
                        const commandData = AllCommands[commandName];
                        if (embedCommands?.data?.fields?.length + commandData.commandsSize > 24) break;
                        const command = client.application.commands.cache.find(cmd => cmd.name == commandName);
                        if (commandData.subGroup)
                        {
                            for (const subGroupName in commandData.subGroup)
                            {
                                const subGroupData = commandData.subGroup[subGroupName];
                                if (subGroupData.length > 0)
                                {
                                    for (const sub of subGroupData)
                                    {
                                        embedCommands.addFields(
                                            {
                                                name: `</${commandName} ${subGroupName} ${sub.name}:${command.id}>`,
                                                value: `${sub.description}`
                                            }
                                        )
                                    };
                                }
                                else
                                {
                                    embedCommands.addFields(
                                        {
                                            name: `</${commandName} ${subGroupName}:${command.id}>`,
                                            value: `${sub.description}`
                                        }
                                    )
                                };
                            };
                        };
                        if (commandData.sub)
                        {
                            for (const sub of commandData.sub)
                            {
                                embedCommands.addFields(
                                    {
                                        name: `</${commandName} ${sub.name}:${command.id}>`,
                                        value: `${sub.description}`
                                    }
                                )
                            };
                        };
                        if (!commandData.subGroup && !commandData.sub)
                        {
                            embedCommands.addFields(
                                {
                                    name: `</${commandName}:${command.id}>`,
                                    value: `${commandData.description}`
                                }
                            )
                        };
                    }
                    if (nbrAllSubOfAllCommands) {
                        var rowPagination = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("[no-check]Previous")
                            .setDisabled(true)
                            .setEmoji("◀️")
                            .setStyle(1),
                            new ButtonBuilder()
                            .setCustomId("[no-check]")
                            .setDisabled(true)
                            .setLabel(`1/${Math.ceil(nbrAllSubOfAllCommands/25)}`)
                            .setStyle(1),
                            new ButtonBuilder()
                            .setCustomId("[no-check]Next")
                            .setDisabled(false)
                            .setEmoji("▶️")
                            .setStyle(1),
                        );
                    }
                }
                if (nbrAllSubOfAllCommands > 25) {
                    inter.update({
                        embeds: [embedCommands],
                        components: [
                            new ActionRowBuilder().addComponents(
                                SelectMenuHelp
                            ),
                            rowPagination
                        ]
                    }).then(msg => {
                        askSelectMenu(msg);
                        askPagination(msg, embedCommands, AllCommands, nbrAllSubOfAllCommands, embedCommands, rowPagination);
                    })
                } else {
                    inter.update({
                        embeds: [embedCommands],
                    }).then(msg => {
                        askSelectMenu(msg)
                    })}
            })
            .catch((err) => {
                interaction.editReply({
                    components: [
                        new ActionRowBuilder().addComponents(
                            SelectMenuHelp.setDisabled(true)
                        )
                    ],
                });
            })
        }

        function askPagination(msg, commandsEmbed, AllCommands, nbrAllSubOfAllCommands, embedCommands, rowPagination) {
            msg.awaitMessageComponent({
                filter: i => i.customId.startsWith("[no-check]"),
                componentType: ComponentType.Button,
                time: 30 * 1000
            })
            .then(inter => {
                const reponse = inter.customId.replace("[no-check]","")
                const position = inter.message.components[1].components[1].label.split("/")
                let Embed = commandsEmbed;
                Embed.setFields();

                switch (reponse) {
                    case "Previous" : {
                        let i = (Number(position[0])-1)*25-1
                        let j = (Number(position[0])-1)*25-25
                        let p = []
                        Object.values(AllCommands).map(cmd => cmd.commandsSize).reduce((a,b,i) => {
                            if (a + b > 25)
                            {
                                p.push(i);
                                return b
                            }
                            else return a+b
                        })
                        let min = p[position[0] - 3] || 0;
                        let max = p[position[0] - 2] || Object.keys(AllCommands).length;
                        let k = min;

                        while (j <= i && j < nbrAllSubOfAllCommands && k < max) {   
                            let commandName = Object.keys(AllCommands)[k]
                            const commandData = AllCommands[commandName];
                            const command = client.application.commands.cache.find(cmd => cmd.name == commandName);
                            if (commandData.subGroup)
                            {
                                for (const subGroupName in commandData.subGroup)
                                {
                                    const subGroupData = commandData.subGroup[subGroupName];
                                    if (subGroupData.length > 0)
                                    {
                                        for (const sub of subGroupData)
                                        {
                                            embedCommands.addFields(
                                                {
                                                    name: `</${commandName} ${subGroupName} ${sub.name}:${command.id}>`,
                                                    value: `${sub.description}`
                                                }
                                            )
                                        };
                                    }
                                    else
                                    {
                                        embedCommands.addFields(
                                            {
                                                name: `</${commandName} ${subGroupName}:${command.id}>`,
                                                value: `${sub.description}`
                                            }
                                        )
                                    };
                                };
                            };
                            if (commandData.sub)
                            {
                                for (const sub of commandData.sub)
                                {
                                    embedCommands.addFields(
                                        {
                                            name: `</${commandName} ${sub.name}:${command.id}>`,
                                            value: `${sub.description}`
                                        }
                                    )
                                };
                            };
                            if (!commandData.subGroup && !commandData.sub)
                            {
                                embedCommands.addFields(
                                    {
                                        name: `</${commandName}:${command.id}>`,
                                        value: `${commandData.description}`
                                    }
                                )
                            };
                            j++;
                            k++;
                        }
                        if (Number(position[0])-1 == 1) {
                            rowPagination.components[0].setDisabled(true)
                        }
                        rowPagination.components[2].setDisabled(false)
                        rowPagination.components[1].setLabel(`${Number(position[0])-1}/${position[1]}`)
                        inter.update({
                            embeds: [
                                Embed
                            ],
                            components: [
                                inter.message.components[0],
                                rowPagination
                            ]
                        }).then(msg => {
                            askPagination(msg, commandsEmbed, AllCommands, nbrAllSubOfAllCommands, embedCommands, rowPagination)
                        })
                    }break;
                    case "Next" : {
                        let i = Number(position[0])*25+24;
                        let j = Number(position[0])*25;
                        let p = []
                        Object.values(AllCommands).map(cmd => cmd.commandsSize).reduce((a,b,i) => {
                            if (a + b > 25)
                            {
                                p.push(i);
                                return b
                            }
                            else return a+b
                        })
                        let min = p[position[0] - 1];
                        let max = p[position[0]] || Object.keys(AllCommands).length;
                        let k = min;

                        while (j <= i && j < nbrAllSubOfAllCommands && k < max) {
                            let commandName = Object.keys(AllCommands)[k]
                            const commandData = AllCommands[commandName];
                            const command = client.application.commands.cache.find(cmd => cmd.name == commandName);
                            if (commandData.subGroup)
                            {
                                for (const subGroupName in commandData.subGroup)
                                {
                                    const subGroupData = commandData.subGroup[subGroupName];
                                    if (subGroupData.length > 0)
                                    {
                                        for (const sub of subGroupData)
                                        {
                                            embedCommands.addFields(
                                                {
                                                    name: `</${commandName} ${subGroupName} ${sub.name}:${command.id}>`,
                                                    value: `${sub.description}`
                                                }
                                            )
                                        };
                                    }
                                    else
                                    {
                                        embedCommands.addFields(
                                            {
                                                name: `</${commandName} ${subGroupName}:${command.id}>`,
                                                value: `${sub.description}`
                                            }
                                        )
                                    };
                                };
                            };
                            if (commandData.sub)
                            {
                                for (const sub of commandData.sub)
                                {
                                    embedCommands.addFields(
                                        {
                                            name: `</${commandName} ${sub.name}:${command.id}>`,
                                            value: `${sub.description}`
                                        }
                                    )
                                };
                            };
                            if (!commandData.subGroup && !commandData.sub)
                            {
                                embedCommands.addFields(
                                    {
                                        name: `</${commandName}:${command.id}>`,
                                        value: `${commandData.description}`
                                    }
                                )
                            };
                            j++;
                            k++;
                        }
                        if (Number(position[0])+1 == position[1]) {
                            rowPagination.components[2].setDisabled(true)
                        }
                        rowPagination.components[0].setDisabled(false)
                        rowPagination.components[1].setLabel(`${Number(position[0])+1}/${position[1]}`)
                        inter.update({
                            embeds: [
                                Embed
                            ],
                            components: [
                                inter.message.components[0],
                                rowPagination
                            ]
                        }).then(msg => {
                            askPagination(msg, commandsEmbed, AllCommands, nbrAllSubOfAllCommands, embedCommands, rowPagination)
                        })
                    }break;
                }
            })
            .catch((err) => {
                interaction.editReply({
                    components: [
                        new ActionRowBuilder().addComponents(
                            SelectMenuHelp
                        ),
                    ],
                });
            })
        }
    }
}