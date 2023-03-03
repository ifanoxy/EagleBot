import {
    AutocompleteInteraction, CategoryChannel,
    ChannelType,
    ChatInputCommandInteraction,
    EmbedBuilder,
    HexColorString, PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";
import {EagleClient} from "../../../structures/Client";
import {DiscordColor} from "../../../structures/Enumerations/Embed";
import backup from "../../../structures/Managers/backup";

export default {
    data: new SlashCommandBuilder()
        .setName("backup")
        .setDescription("Vous permlet de gérer vos backup")
        .setDMPermission(false)
        .addSubcommand(
            sub => sub.setName("create").setDescription("permet de créer une backup")
                .addStringOption(
                    opt => opt.setName("nom").setDescription("Définissez le nom de la backup").setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('use').setDescription("permet d'utiliser une backup")
                .addStringOption(option =>
                    option.setName("nom").setDescription("définissez le nom de la backup").setRequired(true).setAutocomplete(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('delete').setDescription("permet de supprimer une backup")
                .addStringOption(option =>
                    option.setName("nom").setDescription("définissez le nom de la backup").setRequired(true).setAutocomplete(true)
                )
        )
        .addSubcommand(sub =>
            sub.setName('list').setDescription("permet de voir la liste des backup")
        ),
    async autocomplete(interaction: AutocompleteInteraction, client: EagleClient) {
        const focusedValue = interaction.options.getFocused();
        const backupData = client.managers.backupManager.map(x => x).filter(x => x.userId == interaction.user.id);
        const choices = backupData.map(x => ({
            name: x.name,
            guild: x.guild.name,
            chn: x.channels?.length || 0,
            roles: x.roles?.length || 0,
            emojis: x.emojis?.length || 0,
            sticker: x.stickers?.length || 0,
            bans: x.bans?.length || 0,
        }))
        const filtered = choices.filter(choice => choice.name.includes(focusedValue) || choice.guild.includes(focusedValue)).slice(0, 25);
        await interaction.respond(
            filtered.map(choice => ({ name: `${choice.name} - ${choice.guild} | ${choice.chn} Channels / ${choice.roles} Roles / ${choice.sticker} Stickers / ${choice.emojis} Emojis / ${choice.bans} bans`, value: choice.name })),
        );
    },

    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {
        this[interaction.options.getSubcommand()](interaction, client)
    },

    async create(interaction: ChatInputCommandInteraction, client: EagleClient) {
        const name = interaction.options.getString("nom");
        const hexColorCharging: HexColorString[] = ["#212748", "#114870", "#006998", "#008da5", "#00b0b1", "#2cd19c", "#57f287"];
        let description = [
            `Channels: \`0\`/\`${interaction.guild.channels.cache.size}\``,
            `Roles: \`0\`/\`${interaction.guild.roles.cache.size}\``,
            `Émojis: \`0\`/\`${interaction.guild.emojis.cache.size}\``,
            `Stickers: \`0\`/\`${interaction.guild.stickers.cache.size}\``,
            `Bans: \`0\`/\`${interaction.guild.bans.cache.size}\``
        ]
        let embed = new EmbedBuilder()
            .setTitle("Création d'une backup | En cours")
            .setDescription(description.join("\n"))
            .setTimestamp()
            .setColor(hexColorCharging[0])
        const reply = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });
        let i = 0;
        let time = Date.now();
        const ChannelsData = await interaction.guild.channels.fetch().then(channels => {
            return channels.filter(x => x.type == ChannelType.GuildCategory || !x.parent).map(channel => {
                i++;
                if (channel.type == ChannelType.GuildCategory) {
                    return {
                        name: channel.name,
                        type: channel.type,
                        id: channel.id,
                        topic: null,
                        position: channel.rawPosition,
                        permissions: channel.permissionOverwrites?.cache.toJSON(),
                        children: channel.children?.cache.map(child => {
                            i++;
                            return {
                                name: child.name,
                                type: child.type,
                                id: child.id,
                                // @ts-ignore
                                topic: child.topic || null,
                                position: child.position,
                                permissions: child.permissionOverwrites?.cache.toJSON()
                            }
                        })
                    }
                } else {
                    return {
                        name: channel.name,
                        type: channel.type,
                        id: channel.id,
                        // @ts-ignore
                        topic: channel.topic || null,
                        position: channel.position,
                        permissions: channel.permissionOverwrites?.cache.toJSON()
                    }
                }
            });
        });

        description[0] = `Channels: \`${i}\`/\`${interaction.guild.channels.cache.size}\` *${Date.now() - time}ms*`;
        i = 0;
        time = Date.now();
        await reply.edit({
            embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[1])]
        });

        const RolesData = await interaction.guild.roles.fetch().then(roles => {
            return roles.map(role => {
                i++;
                return {
                    name: role.name,
                    id: role.id,
                    color: role.color,
                    position: role.position,
                    icon: role.iconURL(),
                    permissions: role.permissions.toJSON(),
                    mentionable: role.mentionable,
                }
            })
        });

        description[1] = `roles: \`${i}\`/\`${interaction.guild.roles.cache.size}\` *${Date.now() - time}ms*`;
        i = 0;
        time = Date.now();
        await reply.edit({
            embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[2])]
        });

        const EmojisData = await interaction.guild.emojis.fetch().then(emojis => {
            return emojis.map(emoji => {
                i++;
                return {
                    name: emoji.name,
                    url: emoji.url
                }
            })
        });

        description[2] = `Émojis: \`${i}\`/\`${interaction.guild.emojis.cache.size}\` *${Date.now() - time}ms*`;
        i = 0;
        time = Date.now();
        await reply.edit({
            embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[3])]
        });

        const StickerData = await interaction.guild.stickers.fetch().then(stickers => {
            return stickers.map(sticker => {
                i++;
                return {
                    name: sticker.name,
                    description: sticker.description,
                    url: sticker.url,
                    tags: sticker.tags,
                }
            })
        })

        description[3] = `Stickers: \`${i}\`/\`${interaction.guild.stickers.cache.size}\` *${Date.now() - time}ms*`;
        i = 0;
        time = Date.now();
        await reply.edit({
            embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[4])]
        });

        const BansData = await interaction.guild.bans.fetch().then(bans => {
            return  bans.map(ban => {
                i++
                return {
                    userId: ban.user.id,
                    reason: ban.reason,
                }
            })
        });

        description[4] = `Bans: \`${i}\`/\`${interaction.guild.bans.cache.size}\` *${Date.now() - time}ms*`
        i = 0;
        time = Date.now();
        await reply.edit({
            embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[5])]
        });

        let backupdata = client.managers.backupManager.getAndCreateIfNotExists(`${interaction.user.id}-${name}`, {
            userId: interaction.user.id,
            name: name,
        });
        backupdata.userId = interaction.user.id;
        backupdata.name = name;
        backupdata.guild = {
            name: interaction.guild.name,
            ownerId: interaction.guild.ownerId,
            iconURL: interaction.guild.iconURL() || null,
        };
        if (ChannelsData) backupdata.channels = ChannelsData;
        if (RolesData) backupdata.roles = RolesData;
        if (EmojisData) backupdata.emojis = EmojisData;
        if (BansData) backupdata.bans = BansData;
        if (StickerData) backupdata.stickers = StickerData;
        backupdata.save().then(() => {
            reply.edit({
                embeds: [embed.setColor(hexColorCharging[6]).setTitle("Création d'une backup | Terminé")]
            })
        })
    },

    async use(interaction: ChatInputCommandInteraction, client: EagleClient) {
        await interaction.deferReply({})
        const backupData = client.managers.backupManager.getIfExist(`${interaction.user.id}-${interaction.options.getString("nom")}`);
        client.guilds.create({
            name: backupData.guild.name + " | Backup",
            icon: backupData.guild.iconURL,
        }).then(async guild => {
            backupData.emojis.forEach(emoji => {
                guild.emojis.create({
                    name: emoji.name,
                    attachment: emoji.url,
                }).catch()
            });
            backupData.stickers.forEach(sticker => {
                guild.stickers.create({
                    tags: sticker.tags,
                    name: sticker.name,
                    description: sticker.description,
                    file: sticker.url
                }).catch()
            });
            backupData.channels.map(channel => {
                if (channel.child) {
                    guild.channels.create({
                        name: channel.name,
                        position: channel.position,
                        type: channel.type,
                        permissionOverwrites: channel.permissions,
                        topic: channel.topic
                    }).then((parent: CategoryChannel) => {
                        channel.child.map(child => {
                            guild.channels.create({
                                name: child.name,
                                parent: parent,
                                topic: child.topic,
                                position: child.position,
                                type: child.type,
                                permissionOverwrites: child.permissions,
                            })
                        })
                    })
                } else {
                    guild.channels.create({
                        name: channel.name,
                        topic: channel.topic,
                        position: channel.position,
                        type: channel.type,
                        permissionOverwrites: channel.permissions,
                    })
                };
            });
            backupData.roles.sort(x => x.position).map(role => {
                guild.roles.create({
                    name: role.name,
                    position: role.position,
                    // @ts-ignore
                    permissions: new PermissionsBitField(role.permissions),
                    color: role.color,
                    mentionable: role.mentionable,
                })
            });
            console.log(backupData.bans)
            backupData.bans.forEach(ban => {
                guild.bans.create(ban.userId, {reason: ban.reason}).catch()
            });

            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Le serveur à été créer avec succès !")
                        .setColor(DiscordColor.Eagle)
                        // @ts-ignore
                        .setDescription(`[rejoindre le serveur](${await guild.invites.create(guild.channels.cache.filter(x => x.type == ChannelType.GuildText).first())})`)
                        .setTimestamp()
                ]
            })
        })
    },

    delete(interaction: ChatInputCommandInteraction, client: EagleClient) {

    },

    list(interaction: ChatInputCommandInteraction, client: EagleClient) {

    },
}