const { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js");
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
                time: 60 * 1000
            })
            .then(async inter => {
                if (inter.values[0] == "Accueil") {
                    var embedCommands = acceuilEmbed
                } else {
                    const files = client._fs.readdirSync(`SlashCommands/${inter.values[0]}`)
                    var embedCommands = new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle(`Aide des commandes ${inter.values[0]}`)
    
                    let AllCommands = {}
                    for (let file of files) {
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

                        AllCommands[`${commands.name}`] = {
                            description: path.data.description,
                            subGroup: Object.keys(subGroup_Object).length == 0 ? null : subGroup_Object,
                            sub: sub_Array.length == 0 ? null : sub_Array,
                        }
                        
                    }


                    for (let commandName in AllCommands) {
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
                    }
                }

                
                inter.update({
                    embeds: [embedCommands]
                }).then(msg => {
                    askSelectMenu(msg)
                })
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
    }
}