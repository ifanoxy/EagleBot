const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, CommandInteraction, ActionRowBuilder, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle, ComponentType, InteractionType, RoleSelectMenuBuilder, Embed } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("counter")
    .setDescription("permet de créer des compteurs sur votre serveur")
    .setDMPermission(false),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        const sendEmbed = new EmbedBuilder()
        .setColor("#4aa832")
        .setTitle("Créateur de compteur")
        .setDescription(`
        Vous pouvez des channels qui s'actualiseront toute les 10 minutes et qui donneront le renseignement
        que vous souhaitez parmis ceux ci-dessous :

        **Channels**
        > :regional_indicator_a: \` All      \` (vocals, textuels, catégories, etc)
        > :regional_indicator_b: \` Textuels \`
        > :regional_indicator_c: \` Vocals   \`

        **Roles**
        > :regional_indicator_d: \` All     \` (tout les roles de votre serveur)
        > :regional_indicator_e: \` Membres \` en ligne avec un rôle précis

        **Membres**
        > :regional_indicator_f: \` All     \` (tout les utilisateurs de votre serveur)
        > :regional_indicator_g: \` Humains \`
        > :regional_indicator_h: \` Bots    \`

        **Vocals**
        > :regional_indicator_i: \` All  \` (tout les utilisateurs actuellement en vocal)

        **Status**
        > :regional_indicator_j: \` Membre en ligne       \` (online)
        > :regional_indicator_k: \` Membre hors ligne     \` (offline/invisible)
        > :regional_indicator_l: \` Membre pas hors ligne \` (online + dnd + idle)
        `)
        .setFooter({text: "expiration dans 1 minute"})
        interaction.reply({
            embeds: [
                sendEmbed
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                    .setMinValues(1)
                    .setMaxValues(12)
                    .setPlaceholder("Choisissez le compteur que vous souhaitez")
                    .setCustomId("[no-check]SM_counter_decision")
                    .addOptions(
                        {
                            emoji: "🇦", label: "Channels All", value: "Channels_All",
                        }, {
                            emoji: "🇧", label: "Channels Textuels", value: "Channels_Text",
                        }, {
                            emoji: "🇨", label: "Channels Vocals", value: "Channels_Voice",
                        }, {
                            emoji: "🇩", label: "Roles All", value: "Roles_All",
                        }, {
                            emoji: "🇪", label: "Roles Membres", value: "Roles_Members",
                        }, {
                            emoji: "🇫", label: "Membres All", value: "Members_All",
                        }, {
                            emoji: "🇬", label: "Membres Humains", value: "Members_Humans",
                        }, {
                            emoji: "🇭", label: "Membres Bots", value: "Members_Bots",
                        }, {
                            emoji: "🇮", label: "Vocals All", value: "Voice_All",
                        }, {
                            emoji: "🇯", label: "Status En Ligne", value: "Status_Online",
                        }, {
                            emoji: "🇰", label: "Status Hors Ligne", value: "Status_Offline",
                        }, {
                            emoji: "🇱", label: "Status Pas Hors Ligne", value: "Status_NotOffline",
                        },
                    )
                ),
                new ActionRowBuilder().addComponents(
                    new ChannelSelectMenuBuilder()
                    .setCustomId("[no-check]SM_counter_categorie")
                    .setPlaceholder("Optionel | Choisissez une catégorie")
                    .setChannelTypes(ChannelType.GuildCategory)
                    .setMaxValues(1)
                    .setDisabled(true)
                ),
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setDisabled(true)
                    .setLabel("Valider")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId("[no-check]SM_counter_validate")
                )
            ],
            ephemeral: true
        })
        .then(msg => {
            const collector = msg.createMessageComponentCollector({
                filter: i => i.customId.startsWith("[no-check]SM_counter_"),
                max: 1,
                time: 60 * 1000,
            })
            collector.on('collect', interCollector => {
                const values = interCollector.values;
                interCollector.update({
                    embeds: [
                        sendEmbed.addFields({
                            name: "Compteurs choisis :",
                            value: "`" + values.join("`\n`") + "`"
                        })
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new StringSelectMenuBuilder()
                            .setPlaceholder("Choisissez le compteur que vous souhaitez")
                            .setDisabled(true)
                            .setCustomId("[no-check]SM_counter_decision")
                            .setOptions(
                                {
                                    label: "nothing",
                                    value: "nothing"
                                }
                            )
                        ),
                        new ActionRowBuilder().addComponents(
                            new ChannelSelectMenuBuilder()
                            .setCustomId("[no-check]SM_counter_categorie")
                            .setPlaceholder("Optionel | Choisissez une catégorie")
                            .setChannelTypes(ChannelType.GuildCategory)
                            .setMaxValues(1)
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                            .setDisabled(false)
                            .setLabel("Valider")
                            .setStyle(ButtonStyle.Success)
                            .setCustomId("[no-check]SM_counter_validate")
                        )
                    ],
                }).then(msg => {
                    const collector = msg.createMessageComponentCollector({
                        filter: i => i.customId.startsWith("[no-check]SM_counter_"),
                        max: 1,
                        time: 60 * 1000,
                    })
                    collector.on("collect", interCollector2 => {
                        if (interCollector2.isButton()) {
                            interCollector2.update({
                                embeds: [
                                    new EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle("Création des channels compteurs")
                                    .setDescription(`Ces channels seront ajoutés dans une nouvelle catégorie *(vous pourrez changer son nom)* puisque celle-ci n'a pas été renseignée.\n\nChannel choisie : \`\`\`\n${values.join("\n")}\`\`\``)
                                    .setTimestamp(),
                                    new EmbedBuilder()
                                    .setColor("Red")
                                    .setDescription("Il peut avoir un délai lors de la création, discord nous limite à 5 channels simultanéments")
                                ],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new StringSelectMenuBuilder()
                                        .setPlaceholder("Choisissez le compteur que vous souhaitez")
                                        .setDisabled(true)
                                        .setCustomId("[no-check]SM_counter_decision")
                                        .setOptions(
                                            {
                                                label: "nothing",
                                                value: "nothing"
                                            }
                                        )
                                    ),
                                    new ActionRowBuilder().addComponents(
                                        new ChannelSelectMenuBuilder()
                                        .setDisabled(true)
                                        .setCustomId("[no-check]SM_counter_categorie")
                                        .setPlaceholder("Optionel | Choisissez une catégorie")
                                        .setChannelTypes(ChannelType.GuildCategory)
                                        .setMaxValues(1)
                                    ),
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                        .setDisabled(true)
                                        .setLabel("Valider")
                                        .setStyle(ButtonStyle.Success)
                                        .setCustomId("[no-check]SM_counter_validate")
                                    )
                                ]
                            });

                            interaction.guild.channels.create({
                                name: "Serveurs Stats",
                                type: ChannelType.GuildCategory,
                                permissionOverwrites: [
                                    {
                                        id: interaction.guild.roles.everyone.id,
                                        deny: [PermissionsBitField.All],
                                        allow: [PermissionsBitField.Flags.ViewChannel]
                                    }
                                ],
                                position: 0,
                                topic: "channel créé automatiquement afin de mettre les informations de votre serveur (actualisés toute les 5 minutes)."
                            })
                            .then(async category => {
                                createChannel(category, interaction, values)
                            })
                            .catch(() => {
                                interaction.editReply({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setColor("Fuchsia")
                                        .setDescription("Il y a eu un problème lors de la création de la catégorie")
                                    ]
                                })
                            });
                        } else {
                            const categoryId = interCollector2.values[0]
                            
                            interCollector2.update({
                                embeds: [
                                    sendEmbed.addFields({
                                        name: "Catégorie choisie",
                                        value: `<#${categoryId}>`
                                    })
                                ],
                                components: [
                                    new ActionRowBuilder().addComponents(
                                        new StringSelectMenuBuilder()
                                        .setPlaceholder("Choisissez le compteur que vous souhaitez")
                                        .setDisabled(true)
                                        .setCustomId("[no-check]SM_counter_decision")
                                        .setOptions(
                                            {
                                                label: "nothing",
                                                value: "nothing"
                                            }
                                        )
                                    ),
                                    new ActionRowBuilder().addComponents(
                                        new ChannelSelectMenuBuilder()
                                        .setDisabled(true)
                                        .setCustomId("[no-check]SM_counter_categorie")
                                        .setPlaceholder("Optionel | Choisissez une catégorie")
                                        .setChannelTypes(ChannelType.GuildCategory)
                                        .setMaxValues(1)
                                    ),
                                    new ActionRowBuilder().addComponents(
                                        new ButtonBuilder()
                                        .setDisabled(false)
                                        .setLabel("Valider")
                                        .setStyle(ButtonStyle.Success)
                                        .setCustomId("[no-check]SM_counter_validate")
                                    )
                                ],
                            })
                            .then(msg2 => {
                                const collector = msg2.createMessageComponentCollector({
                                    filter: i => i.customId.startsWith("[no-check]SM_counter_"),
                                    max: 1,
                                    time: 60 * 1000,
                                })
                                collector.on("collect", interCollector4 => {
                                        interCollector4.update({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setColor("Green")
                                                .setTitle("Création des channels compteurs")
                                                .setDescription(`Ces channels seront ajoutés dans une nouvelle catégorie *(vous pourrez changer son nom)* puisque celle-ci n'a pas été renseignée.\n\nChannel choisie : \`\`\`\n${values.join("\n")}\`\`\``)
                                                .setTimestamp(),
                                                new EmbedBuilder()
                                                .setColor("Red")
                                                .setDescription("Il peut avoir un délai lors de la création, discord nous limite à 5 channels simultanéments")
                                            ],
                                            components: [
                                                new ActionRowBuilder().addComponents(
                                                    new StringSelectMenuBuilder()
                                                    .setPlaceholder("Choisissez le compteur que vous souhaitez")
                                                    .setDisabled(true)
                                                    .setCustomId("[no-check]SM_counter_decision")
                                                    .setOptions(
                                                        {
                                                            label: "nothing",
                                                            value: "nothing"
                                                        }
                                                    )
                                                ),
                                                new ActionRowBuilder().addComponents(
                                                    new ChannelSelectMenuBuilder()
                                                    .setDisabled(true)
                                                    .setCustomId("[no-check]SM_counter_categorie")
                                                    .setPlaceholder("Optionel | Choisissez une catégorie")
                                                    .setChannelTypes(ChannelType.GuildCategory)
                                                    .setMaxValues(1)
                                                ),
                                                new ActionRowBuilder().addComponents(
                                                    new ButtonBuilder()
                                                    .setDisabled(true)
                                                    .setLabel("Valider")
                                                    .setStyle(ButtonStyle.Success)
                                                    .setCustomId("[no-check]SM_counter_validate")
                                                )
                                            ]
                                        });
            
                                        createChannel(interaction.guild.channels.cache.get(categoryId), interaction, values)
                                    })
                                })
                        }
                    });
                    collector.on('end', (collected, reason) => {
                        if (reason != "time") return
                        interaction.editReply({
                            components: [
                                new ActionRowBuilder().addComponents(
                                    new StringSelectMenuBuilder()
                                    .setPlaceholder("Choisissez le compteur que vous souhaitez")
                                    .setDisabled(true)
                                    .setCustomId("[no-check]SM_counter_decision")
                                    .setOptions(
                                        {
                                            label: "nothing",
                                            value: "nothing"
                                        }
                                    )
                                ),
                                new ActionRowBuilder().addComponents(
                                    new ChannelSelectMenuBuilder()
                                    .setCustomId("[no-check]SM_counter_categorie")
                                    .setDisabled(true)
                                    .setPlaceholder("Optionel | Choisissez une catégorie")
                                    .setChannelTypes(ChannelType.GuildCategory)
                                    .setMaxValues(1)
                                ),
                                new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                    .setDisabled(true)
                                    .setLabel("Valider")
                                    .setStyle(ButtonStyle.Success)
                                    .setCustomId("[no-check]SM_counter_validate")
                                )
                            ],
                        })
                    });
                });
            });
            collector.on('end', (collected, reason) => {
                if (reason != "time") return
                interaction.editReply({
                    components: [
                        new ActionRowBuilder().addComponents(
                            new StringSelectMenuBuilder()
                            .setPlaceholder("Choisissez le compteur que vous souhaitez")
                            .setDisabled(true)
                            .setCustomId("[no-check]SM_counter_decision")
                            .setOptions(
                                {
                                    label: "nothing",
                                    value: "nothing"
                                }
                            )
                        ),
                        new ActionRowBuilder().addComponents(
                            new ChannelSelectMenuBuilder()
                            .setCustomId("[no-check]SM_counter_categorie")
                            .setDisabled(true)
                            .setPlaceholder("Optionel | Choisissez une catégorie")
                            .setChannelTypes(ChannelType.GuildCategory)
                            .setMaxValues(1)
                        ),
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                            .setDisabled(true)
                            .setLabel("Valider")
                            .setStyle(ButtonStyle.Success)
                            .setCustomId("[no-check]SM_counter_validate")
                        )
                    ],
                })
            });
        });

        async function createChannel(category, interaction, values) {
            var database = client.managers.statsManager.getAndCreateIfNotExists(interaction.guildId, {
            guildId: interaction.guildId
        });
        for (let value of values) {
            switch (value) {
                case "Channels_All" : {
                    interaction.guild.channels.create({
                        name: `Channels Totaux: ${interaction.guild.channels.cache.size}`,
                        type: ChannelType.GuildVoice,
                        parent: category.id
                    }).then(channel => {
                        database.data.push(
                            {
                                type: "Channels_All",
                                channelId: channel.id
                            }
                        )
                        database.save()
                    }).catch(err => {
                        client.error(err)
                    })
                }break;
                case "Channels_Text" : {
                    interaction.guild.channels.create({
                        name: `Channels Textuels: ${interaction.guild.channels.cache.filter(c => c.type == ChannelType.GuildText).size}`,
                        type: ChannelType.GuildVoice,
                        parent: category.id
                    }).then(channel => {
                        database.data.push(
                            {
                                type: "Channels_Text",
                                channelId: channel.id
                            }
                        )
                        database.save()
                    }).catch(err => {
                        client.error(err)
                    })
                }break;
                case "Channels_Voice" : {
                    interaction.guild.channels.create({
                        name: `Channels Vocaux: ${interaction.guild.channels.cache.filter(c => c.type == ChannelType.GuildVoice).size}`,
                        type: ChannelType.GuildVoice,
                        parent: category.id
                    }).then(channel => {
                        database.data.push(
                            {
                                type: "Channels_Voice",
                                channelId: channel.id
                            }
                        )
                        database.save()
                    }).catch(err => {
                        client.error(err)
                    })
                }break;
                case "Roles_All" : {
                    interaction.guild.channels.create({
                        name: `Roles Totaux: ${interaction.guild.roles.cache.size}`,
                        type: ChannelType.GuildVoice,
                        parent: category.id
                    }).then(channel => {
                        database.data.push(
                            {
                                type: "Roles_All",
                                channelId: channel.id
                            }
                        )
                        database.save()
                    }).catch(err => {
                        client.error(err)
                    })
                }break;
                case "Roles_Members" : {
                    interCollector2.message.components.map(x => x.components.map(y => y.data.disabled = true))
                    interaction.editReply({
                        embeds: [
                            interCollector2.message.embeds[0],
                            new EmbedBuilder()
                            .setColor("Yellow")
                            .setTitle("Définissez le rôle que vous voulez pour votre compteur")
                        ],
                        components: [
                            interCollector2.message.components[0],
                            interCollector2.message.components[1],
                            interCollector2.message.components[2],
                            new ActionRowBuilder().addComponents(
                                new RoleSelectMenuBuilder()
                                .setCustomId("[no-check]SM_counter_role")
                                .setMaxValues(1)
                                .setPlaceholder("Choissez le rôle")
                            )
                        ]
                    }).then(message => {
                        const collector = message.createMessageComponentCollector({
                            time: 30 * 1000,
                            componentType: ComponentType.RoleSelect,
                            filter: i => i.customId == "[no-check]SM_counter_role"
                        });
                        collector.on("collect", interCollector3 => {
                            const roleId = interCollector3.values[0]
                            interaction.guild.channels.create({
                                name: `${interaction.guild.roles.cache.get(roleId).name}: ${interaction.guild.roles.cache.get(roleId).members.size}`,
                                type: ChannelType.GuildVoice,
                                parent: category.id,
                            }).then(channel => {
                                database.data.push(
                                    {
                                        type: "Roles_Members",
                                        channelId: channel.id,
                                        roleId: roleId,
                                    }
                                )
                                database.save()
                                interCollector3.update({
                                    components: [
                                        interCollector2.message.components[0],
                                        interCollector2.message.components[1],
                                        interCollector2.message.components[2],
                                    ]
                                })
                            }).catch(err => {
                                client.error(err)
                            })
                        });

                        collector.on("end", (collected, reason) => {
                            if (reason != "time") return;
                        })
                    })
                }break;
                case "Members_All" : {
                    interaction.guild.channels.create({
                        name: `Utilisateurs: ${interaction.guild.members.cache.size}`,
                        type: ChannelType.GuildVoice,
                        parent: category.id
                    }).then(channel => {
                        database.data.push(
                            {
                                type: "Members_All",
                                channelId: channel.id
                            }
                        )
                        database.save()
                    }).catch(err => {
                        client.error(err)
                    })
                }break;
                case "Members_Humans" : {
                    interaction.guild.channels.create({
                        name: `Membres: ${interaction.guild.members.cache.filter(m => !m.user.bot).size}`,
                        type: ChannelType.GuildVoice,
                        parent: category.id
                    }).then(channel => {
                        database.data.push(
                            {
                                type: "Members_Humans",
                                channelId: channel.id
                            }
                        )
                        database.save()
                    }).catch(err => {
                        client.error(err)
                    })
                }break;
                case "Members_Bots" : {
                    interaction.guild.channels.create({
                        name: `Bots: ${interaction.guild.members.cache.filter(m => m.user.bot).size}`,
                        type: ChannelType.GuildVoice,
                        parent: category.id
                    }).then(channel => {
                        database.data.push(
                            {
                                type: "Members_Bots",
                                channelId: channel.id
                            }
                        )
                        database.save()
                    }).catch(err => {
                        client.error(err)
                    })
                }break;
                case "Voice_All" : {
                    interaction.guild.channels.create({
                        name: `Membres en vocal: ${interaction.guild.members.cache.filter(m => m.voice.channel).size}`,
                        type: ChannelType.GuildVoice,
                        parent: category.id
                    }).then(channel => {
                        database.data.push(
                            {
                                type: "Voice_All",
                                channelId: channel.id
                            }
                        )
                        database.save()
                    }).catch(err => {
                        client.error(err)
                    })
                }break;
                case "Status_Online" : {
                    interaction.guild.channels.create({
                        name: `Membres en ligne: ${await interaction.guild.members.fetch().then(data => data.filter(x => x.presence?.status == "online").size)}/${interaction.guild.members.cache.size}`,
                        type: ChannelType.GuildVoice,
                        parent: category.id
                    }).then(channel => {
                        database.data.push(
                            {
                                type: "Status_Online",
                                channelId: channel.id
                            }
                        )
                        database.save()
                    }).catch(err => {
                        client.error(err)
                    })
                }break;
                case "Status_Offline" : {
                    interaction.guild.channels.create({
                        name: `Membres Inactifs: ${await interaction.guild.members.fetch().then(data => data.filter(x => x.presence?.status == "offline").size)}/${interaction.guild.members.cache.size}`,
                        type: ChannelType.GuildVoice,
                        parent: category.id
                    }).then(channel => {
                        database.data.push(
                            {
                                type: "Status_Offline",
                                channelId: channel.id
                            }
                        )
                        database.save()
                    }).catch(err => {
                        client.error(err)
                    })
                }break;
                case "Status_NotOffline" : {
                    interaction.guild.channels.create({
                        name: `Membres Actifs: ${await interaction.guild.members.fetch().then(data => data.filter(x => x.presence?.status != "offline").size)}/${interaction.guild.members.cache.size}`,
                        type: ChannelType.GuildVoice,
                        parent: category.id
                    }).then(channel => {
                        database.data.push(
                            {
                                type: "Status_NotOffline",
                                channelId: channel.id
                            }
                        )
                        database.save()
                    }).catch(err => {
                        client.error(err)
                    })
                }break;
            }
        }}
    }
}