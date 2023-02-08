const { SlashCommandBuilder, CommandInteraction, PermissionsBitField, EmbedBuilder, Embed, ActionRowBuilder, ButtonBuilder, ComponentType } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("backup")
    .setDescription("permet de faire une backup de votre serveur discord")
    .setDMPermission(false)
    .addSubcommand(sub =>
        sub.setName('créer').setDescription("permet de créer une backup")
        .addStringOption(option =>
            option.setName("nom").setDescription("définissez le nom de la backup").setRequired(true)
        )
    )
    .addSubcommand(sub =>
        sub.setName('utiliser').setDescription("permet d'utiliser une backup")
        .addStringOption(option =>
            option.setName("nom").setDescription("définissez le nom de la backup").setRequired(true)
        )
    )
    .addSubcommand(sub =>
        sub.setName('supprimer').setDescription("permet de supprimer une backup")
        .addStringOption(option =>
            option.setName("nom").setDescription("définissez le nom de la backup").setRequired(true)
        )
    )
    .addSubcommand(sub =>
        sub.setName('liste').setDescription("permet de voir la liste des backup")
    ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {EagleClient} client 
     */
    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor('Red')
                .setDescription("Vous n'avez pas la permission d'utiliser cette commande !")
            ],
            ephemeral: true
        });
        const sub = interaction.options.getSubcommand()
        switch (sub) {
            case "créer" : {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("DarkBlue")
                        .setTitle("Création de la backup en cours")
                        .setDescription(`
                        **channels :** \`0\` sur \`${interaction.guild.channels.cache.size}\`
                        **roles :** \`0\` sur \`${interaction.guild.roles.cache.size}\`
                        **emojis :** \`0\` sur \`${interaction.guild.emojis.cache.size}\`
                        **bans :** \`0\` sur \`${interaction.guild.bans.cache.size}\`
                        `)
                        .setTimestamp()
                    ],
                }).then((message) => {
                    const name = interaction.options.getString("nom")
                    let channelsBackup = [];
                    let rolesBackup = [];
                    let emojisBackup = [];
                    let bansBackup = [];
                    interaction.guild.channels.cache.map(channel => {
                        channelsBackup.push({
                            name: channel.name,
                            type: channel.type,
                            parentId: channel.parentId,
                            id: channel.id,
                            nsfw: channel.nsfw,
                            topic: channel.topic,
                            rawPosition: channel.rawPosition,
                        });
                    });
                    
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor("DarkBlue")
                            .setTitle("Création de la backup en cours")
                            .setDescription(`
                            **channels :** \`${channelsBackup.length}\` sur \`${interaction.guild.channels.cache.size}\`
                            **roles :** \`${rolesBackup.length}\` sur \`${interaction.guild.roles.cache.size}\`
                            **emojis :** \`${emojisBackup.length}\` sur \`${interaction.guild.emojis.cache.size}\`
                            **bans :** \`${bansBackup.length}\` sur \`${interaction.guild.bans.cache.size}\`
                            `)
                            .setTimestamp()
                        ],
                    })
                    interaction.guild.roles.cache.map(role => {
                        if (Object.keys(role.tags).lenght == 0 || role.name == "@everyone")return;
                        rolesBackup.push({
                            id: role.id,
                            name: role.name,
                            color: role.color,
                            rawPosition: role.rawPosition,
                            mentionable: role.mentionable,
                            permissions: role.permissions,
                        })
                    })
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor("DarkBlue")
                            .setTitle("Création de la backup en cours")
                            .setDescription(`
                            **channels :** \`${channelsBackup.length}\` sur \`${interaction.guild.channels.cache.size}\`
                            **roles :** \`${rolesBackup.length}\` sur \`${interaction.guild.roles.cache.size}\`
                            **emojis :** \`${emojisBackup.length}\` sur \`${interaction.guild.emojis.cache.size}\`
                            **bans :** \`${bansBackup.length}\` sur \`${interaction.guild.bans.cache.size}\`
                            `)
                            .setTimestamp()
                        ],
                    })
                    interaction.guild.emojis.cache.map(emoji => {
                        emojisBackup.push({
                            name: emoji.name,
                            url: emoji.url,
                        })
                    })
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor("DarkBlue")
                            .setTitle("Création de la backup en cours")
                            .setDescription(`
                            **channels :** \`${channelsBackup.length}\` sur \`${interaction.guild.channels.cache.size}\`
                            **roles :** \`${rolesBackup.length}\` sur \`${interaction.guild.roles.cache.size}\`
                            **emojis :** \`${emojisBackup.length}\` sur \`${interaction.guild.emojis.cache.size}\`
                            **bans :** \`${bansBackup.length}\` sur \`${interaction.guild.bans.cache.size}\`
                            `)
                            .setTimestamp()
                        ],
                    })
                    for (const ban of interaction.guild.bans.cache) {
                        bansBackup.push(ban[1])
                    }
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setColor("Green")
                            .setTitle("Création de la backup Terminé")
                            .setDescription(`
                            **channels :** \`${channelsBackup.length}\` sur \`${interaction.guild.channels.cache.size}\`
                            **roles :** \`${rolesBackup.length}\` sur \`${interaction.guild.roles.cache.size}\`
                            **emojis :** \`${emojisBackup.length}\` sur \`${interaction.guild.emojis.cache.size}\`
                            **bans :** \`${bansBackup.length}\` sur \`${interaction.guild.bans.cache.size}\`
                            `)
                            .setTimestamp()
                        ],
                    })
    
                    let Data = client.managers.backupManager.getIfExist(interaction.member.id);
                    if (Data) {
                        if(Object.values(Data.data.data).includes(name)) {
                            const i = Object.values(Data.data.data).findIndex(name)
                            Data.data.data[i] = {
                                name: name,
                                channels: {
                                    lenght: channelsBackup.length,
                                    channelsBackup: channelsBackup,
                                },
                                roles: {
                                    lenght: rolesBackup.length,
                                    rolesBackup: rolesBackup,
                                },
                                emojis: {
                                    lenght: emojisBackup.length,
                                    emojisBackup: emojisBackup,
                                },
                                bans: {
                                    lenght: bansBackup.length,
                                    bansBackup: bansBackup,
                                },
                            }
                        }
                    }
                    if(Data != null){
                        Data.data.data.push({
                            name: name,
                            channels: {
                                lenght: channelsBackup.length,
                                channelsBackup: channelsBackup,
                            },
                            roles: {
                                lenght: rolesBackup.length,
                                rolesBackup: rolesBackup,
                            },
                            emojis: {
                                lenght: emojisBackup.length,
                                emojisBackup: emojisBackup,
                            },
                            bans: {
                                lenght: bansBackup.length,
                                bansBackup: bansBackup,
                            },
                        });
                    } else {
                        Data = [{
                            name: name,
                            channels: {
                                lenght: channelsBackup.length,
                                channelsBackup: channelsBackup,
                            },
                            roles: {
                                lenght: rolesBackup.length,
                                rolesBackup: rolesBackup,
                            },
                            emojis: {
                                lenght: emojisBackup.length,
                                emojisBackup: emojisBackup,
                            },
                            bans: {
                                lenght: bansBackup.length,
                                bansBackup: bansBackup,
                            },
                        }]
                    }
                    
                    client.managers.backupManager.getAndCreateIfNotExists(interaction.member.id, {
                        userId: interaction.member.id,
                        data: {
                            userId: interaction.member.id,
                            data: Data
                        }
                    }).save();
                })
            }break;
            case "utiliser" : {
                const name = interaction.options.getString("nom")
                const backupData = await client.managers.backupManager.getIfExist(interaction.user.id)
                if (!backupData)return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("LuminousVividPink")
                        .setTitle("Je n'ai trouvé aucune backup avec ce nom")
                    ],  
                    ephemeral: true
                });
                let check = {nbr: 0, bol: false};
                for (const backup of backupData.data.data) {
                    if(backup.name == name){
                        check.bol = true;
                        break;
                    }
                    check.nbr += 1
                }
                if (!check.bol) return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("LuminousVividPink")
                        .setTitle("Je n'ai trouvé aucune backup avec ce nom")
                    ],  
                    ephemeral: true
                });
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("Purple")
                        .setTitle("Création du serveur de backup")
                        .setThumbnail()
                    ]
                })
                .then(() => {
                    client.guilds.create({
                        name: `Backup - ${name}`,
                        roles: backupData.data.data[check.nbr].roles.rolesBackup.filter(p => p.name != "everyone").sort((a,b) => a.rawPosition - b.rawPosition),
                        channels: backupData.data.data[check.nbr].channels.channelsBackup.sort((a,b) => a.rawPosition - b.rawPosition),
                    })
                    .then(async guild => {
                        backupData.data.data[check.nbr].bans.bansBackup.map(b => {
                            guild.bans.create(b)
                        });
                        backupData.data.data[check.nbr].emojis.emojisBackup.map(e => {
                            guild.emojis.create({
                                name: e.name,
                                attachment: e.url,
                            })
                        });
                        let inviteSend = false
                        while (inviteSend == false) {
                            try {
                                interaction.channel.send("https://discord.gg/"+ await guild.invites.create(guild.channels.cache.first()))
                            } catch {
                                continue
                            }
                            inviteSend = true
                        }
                    })
                })
            }break;
            case "supprimer" : {
                const name = interaction.options.getString("nom");
                let backupData = client.managers.backupManager.getIfExist(interaction.user.id);
                let check = {nbr: 0, bol: false};
                for (const backup of backupData.data.data) {
                    if(backup.name == name){
                        check.bol = true;
                        break;
                    }
                    check.nbr += 1
                }
                if (!check.bol)return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("LuminousVividPink")
                        .setTitle("Je n'ai trouvé aucune backup avec ce nom")
                    ],  
                    ephemeral: true
                });

                backupData.data.data.splice(check.nbr, 1);
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("Green")
                        .setTitle(`la backup nommé ${name} vient d'être supprimé`)
                    ],  
                    ephemeral: true
                });
                backupData.save()
            }break;
            case "liste" : {
                let backupData = client.managers.backupManager.getIfExist(interaction.user.id);
                if(!backupData)return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setColor("LuminousVividPink")
                        .setTitle("Vous n'avez aucune backup")
                    ],  
                    ephemeral: true
                });
                let Embed = new EmbedBuilder().setColor("DarkBlue").setTitle(`Liste de vos ${backupData.data.data.length} backups`);
                let Row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("[no-check]Previous")
                    .setDisabled(true)
                    .setEmoji("◀️")
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId("[no-check]")
                    .setDisabled(true)
                    .setLabel(`1/${Math.ceil(backupData.data.data.length/25)}`)
                    .setStyle(1),
                    new ButtonBuilder()
                    .setCustomId("[no-check]Next")
                    .setDisabled(false)
                    .setEmoji("▶️")
                    .setStyle(1),
                );

                for (const backup of backupData.data.data) {
                    let i = Embed?.data.fields?.length || 0;
                    Embed.addFields(
                        {name: `${i+1}. ${backup.name}`, value: `Nombre de channels: ${backup.channels.lenght}\nNombre de roles: ${backup.roles.lenght}\nNombre d'Emojis: ${backup.emojis.lenght}\nNombre de bans: ${backup.bans.lenght}`, inline: true}
                    )
                    if (i == 24)break;
                }

                if (backupData.data.data.length <= 24) {
                    interaction.reply({
                        embeds: [
                            Embed
                        ]
                    })
                } else {
                    interaction.reply({
                        embeds: [
                            Embed
                        ],
                        components: [
                            Row
                        ]
                    }).then(msg => {
                        messageEdit(msg, interaction)
                    })

                    function messageEdit(msg, interaction) {
                        const collector = msg.createMessageComponentCollector({
                            time: 15*1000,
                            componentType: ComponentType.Button,
                            max: 1
                        })
                        collector.on('collect', inter => { 
                            const reponse = inter.customId.replace("[no-check]","")
                            const position = inter.message.components[0].components[1].label.split("/")
                            Embed.setFields()
                            switch (reponse) {
                                case "Previous" : {
                                    let i = (Number(position[0])-1)*25-1
                                    let j = (Number(position[0])-1)*25-25
                                    while (j <= i && j < backupData.data.length) {
                                        Embed.addFields(
                                            {name: `${j+1}. ${backupData.data[j].name}`, value: `Nombre de channels: ${backupData.data[j].channels.lenght}\nNombre de roles: ${backupData.data[j].roles.lenght}\nNombre d'Emojis: ${backupData.data[j].emojis.lenght}\nNombre de bans: ${backupData.data[j].bans.lenght}`, inline: true}
                                        )
                                        j++;
                                    }
                                    if (Number(position[0])-1 == 1) {
                                        Row.components[0].setDisabled(true)
                                    }
                                    Row.components[2].setDisabled(false)
                                    Row.components[1].setLabel(`${Number(position[0])-1}/${position[1]}`)
                                    inter.update({
                                        embeds: [
                                            Embed
                                        ],
                                        components: [
                                            Row
                                        ]
                                    }).then(msg => {
                                        messageEdit(msg, interaction)
                                    })
                                }break;
                                case "Next" : {
                                    let i = Number(position[0])*25+24
                                    let j = Number(position[0])*25
                                    while (j <= i && j < backupData.data.length) {
                                        Embed.addFields(
                                            {name: `${j+1}. ${backupData.data[j].name}`, value: `Nombre de channels: ${backupData.data[j].channels.lenght}\nNombre de roles: ${backupData.data[j].roles.lenght}\nNombre d'Emojis: ${backupData.data[j].emojis.lenght}\nNombre de bans: ${backupData.data[j].bans.lenght}`, inline: true}
                                        )
                                        j++;
                                    }
                                    if (Number(position[0])+1 == position[1]) {
                                        Row.components[2].setDisabled(true)
                                    }
                                    Row.components[0].setDisabled(false)
                                    Row.components[1].setLabel(`${Number(position[0])+1}/${position[1]}`)
                                    inter.update({
                                        embeds: [
                                            Embed
                                        ],
                                        components: [
                                            Row
                                        ]
                                    }).then(msg => {
                                        messageEdit(msg, interaction)
                                    })
                                }break;
                            }
                        });
                        collector.on("end", (coll,reason) => {
                            if (reason != "time")return
                            Row.components[0].setDisabled(true)
                            Row.components[2].setDisabled(true)
                            interaction.editReply({
                                components: [
                                    Row
                                ]
                            })
                        })
                    }
                }
            }break;
        }
    }
}