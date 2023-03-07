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
const Embed_1 = require("../../../structures/Enumerations/Embed");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("backup")
        .setDescription("Vous permlet de gérer vos backup")
        .setDMPermission(false)
        .addSubcommand(sub => sub.setName("create").setDescription("permet de créer une backup")
        .addStringOption(opt => opt.setName("nom").setDescription("Définissez le nom de la backup").setRequired(true)))
        .addSubcommand(sub => sub.setName('use').setDescription("permet d'utiliser une backup")
        .addStringOption(option => option.setName("nom").setDescription("définissez le nom de la backup").setRequired(true).setAutocomplete(true)))
        .addSubcommand(sub => sub.setName('delete').setDescription("permet de supprimer une backup")
        .addStringOption(option => option.setName("nom").setDescription("définissez le nom de la backup").setRequired(true).setAutocomplete(true)))
        .addSubcommand(sub => sub.setName('list').setDescription("permet de voir la liste des backup")),
    autocomplete(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const focusedValue = interaction.options.getFocused();
            const backupData = client.managers.backupManager.map(x => x).filter(x => x.userId == interaction.user.id);
            const choices = backupData.map(x => {
                var _a, _b, _c, _d, _e;
                return ({
                    name: x.name,
                    guild: x.guild.name,
                    chn: ((_a = x.channels) === null || _a === void 0 ? void 0 : _a.length) || 0,
                    roles: ((_b = x.roles) === null || _b === void 0 ? void 0 : _b.length) || 0,
                    emojis: ((_c = x.emojis) === null || _c === void 0 ? void 0 : _c.length) || 0,
                    sticker: ((_d = x.stickers) === null || _d === void 0 ? void 0 : _d.length) || 0,
                    bans: ((_e = x.bans) === null || _e === void 0 ? void 0 : _e.length) || 0,
                });
            });
            const filtered = choices.filter(choice => choice.name.includes(focusedValue) || choice.guild.includes(focusedValue)).slice(0, 25);
            yield interaction.respond(filtered.map(choice => ({ name: `${choice.name} - ${choice.guild} | ${choice.chn} Channels / ${choice.roles} Roles / ${choice.sticker} Stickers / ${choice.emojis} Emojis / ${choice.bans} bans`, value: choice.name })));
        });
    },
    execute(interaction, client) {
        this[interaction.options.getSubcommand()](interaction, client);
    },
    create(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = interaction.options.getString("nom");
            const hexColorCharging = ["#212748", "#114870", "#006998", "#008da5", "#00b0b1", "#2cd19c", "#57f287"];
            let description = [
                `Channels: \`0\`/\`${interaction.guild.channels.cache.size}\``,
                `Roles: \`0\`/\`${interaction.guild.roles.cache.size}\``,
                `Émojis: \`0\`/\`${interaction.guild.emojis.cache.size}\``,
                `Stickers: \`0\`/\`${interaction.guild.stickers.cache.size}\``,
                `Bans: \`0\`/\`${(yield interaction.guild.bans.fetch()).size}\``
            ];
            let embed = new discord_js_1.EmbedBuilder()
                .setTitle("Création d'une backup | En cours")
                .setDescription(description.join("\n"))
                .setTimestamp()
                .setColor(hexColorCharging[0]);
            const reply = yield interaction.reply({
                embeds: [embed],
                fetchReply: true
            });
            let i = 0;
            let time = Date.now();
            const ChannelsData = yield interaction.guild.channels.fetch().then(channels => {
                return channels.filter(x => x.type == discord_js_1.ChannelType.GuildCategory || !x.parent).map(channel => {
                    var _a, _b, _c;
                    i++;
                    if (channel.type == discord_js_1.ChannelType.GuildCategory) {
                        return {
                            name: channel.name,
                            type: channel.type,
                            id: channel.id,
                            topic: null,
                            position: channel.rawPosition,
                            permissions: (_a = channel.permissionOverwrites) === null || _a === void 0 ? void 0 : _a.cache.toJSON(),
                            children: (_b = channel.children) === null || _b === void 0 ? void 0 : _b.cache.map(child => {
                                var _a;
                                i++;
                                return {
                                    name: child.name,
                                    type: child.type,
                                    id: child.id,
                                    // @ts-ignore
                                    topic: child.topic || null,
                                    position: child.position,
                                    permissions: (_a = child.permissionOverwrites) === null || _a === void 0 ? void 0 : _a.cache.toJSON()
                                };
                            })
                        };
                    }
                    else {
                        return {
                            name: channel.name,
                            type: channel.type,
                            id: channel.id,
                            // @ts-ignore
                            topic: channel.topic || null,
                            position: channel.position,
                            permissions: (_c = channel.permissionOverwrites) === null || _c === void 0 ? void 0 : _c.cache.toJSON()
                        };
                    }
                });
            });
            description[0] = `Channels: \`${i}\`/\`${interaction.guild.channels.cache.size}\` *${Date.now() - time}ms*`;
            i = 0;
            time = Date.now();
            yield reply.edit({
                embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[1])]
            });
            const RolesData = yield interaction.guild.roles.fetch().then(roles => {
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
                    };
                });
            });
            description[1] = `roles: \`${i}\`/\`${interaction.guild.roles.cache.size}\` *${Date.now() - time}ms*`;
            i = 0;
            time = Date.now();
            yield reply.edit({
                embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[2])]
            });
            const EmojisData = yield interaction.guild.emojis.fetch().then(emojis => {
                return emojis.map(emoji => {
                    i++;
                    return {
                        name: emoji.name,
                        url: emoji.url
                    };
                });
            });
            description[2] = `Émojis: \`${i}\`/\`${interaction.guild.emojis.cache.size}\` *${Date.now() - time}ms*`;
            i = 0;
            time = Date.now();
            yield reply.edit({
                embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[3])]
            });
            const StickerData = yield interaction.guild.stickers.fetch().then(stickers => {
                return stickers.map(sticker => {
                    i++;
                    return {
                        name: sticker.name,
                        description: sticker.description,
                        url: sticker.url,
                        tags: sticker.tags,
                    };
                });
            });
            description[3] = `Stickers: \`${i}\`/\`${interaction.guild.stickers.cache.size}\` *${Date.now() - time}ms*`;
            i = 0;
            time = Date.now();
            yield reply.edit({
                embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[4])]
            });
            const BansData = yield interaction.guild.bans.fetch().then(bans => {
                return bans.map(ban => {
                    i++;
                    return {
                        userId: ban.user.id,
                        reason: ban.reason,
                    };
                });
            });
            description[4] = `Bans: \`${i}\`/\`${interaction.guild.bans.cache.size}\` *${Date.now() - time}ms*`;
            i = 0;
            time = Date.now();
            yield reply.edit({
                embeds: [embed.setDescription(description.join("\n")).setColor(hexColorCharging[5])]
            });
            let backupdata = client.managers.backupManager.getAndCreateIfNotExists(`${interaction.user.id}-${name}`, {
                userId: interaction.user.id,
                name: name,
                guild: {
                    name: interaction.guild.name,
                    ownerId: interaction.guild.ownerId,
                    iconURL: interaction.guild.iconURL() || null,
                }
            });
            backupdata.userId = interaction.user.id;
            backupdata.name = name;
            backupdata.guild = {
                name: interaction.guild.name,
                ownerId: interaction.guild.ownerId,
                iconURL: interaction.guild.iconURL() || null,
            };
            if (ChannelsData)
                backupdata.channels = ChannelsData;
            if (RolesData)
                backupdata.roles = RolesData;
            if (EmojisData)
                backupdata.emojis = EmojisData;
            if (BansData)
                backupdata.bans = BansData;
            if (StickerData)
                backupdata.stickers = StickerData;
            backupdata.save().then(() => {
                reply.edit({
                    embeds: [embed.setColor(hexColorCharging[6]).setTitle("Création d'une backup | Terminé")]
                });
            });
        });
    },
    use(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply({});
            const backupData = client.managers.backupManager.getIfExist(`${interaction.user.id}-${interaction.options.getString("nom")}`);
            client.guilds.create({
                name: backupData.guild.name + " | Backup",
                icon: backupData.guild.iconURL,
            }).then((guild) => __awaiter(this, void 0, void 0, function* () {
                yield Promise.all(guild.channels.cache.map(chn => chn.delete()));
                backupData.emojis.map(emoji => {
                    guild.emojis.create({
                        name: emoji.name,
                        attachment: emoji.url,
                    }).catch();
                });
                backupData.stickers.map(sticker => {
                    guild.stickers.create({
                        tags: sticker.tags,
                        name: sticker.name,
                        description: sticker.description,
                        file: sticker.url
                    }).catch();
                });
                yield Promise.all(backupData.channels.map((channel) => __awaiter(this, void 0, void 0, function* () {
                    if (channel.children) {
                        return yield guild.channels.create({
                            name: channel.name,
                            position: channel.position,
                            type: channel.type,
                            permissionOverwrites: channel.permissions,
                            topic: channel.topic
                        }).then((parent) => __awaiter(this, void 0, void 0, function* () {
                            return channel.children.map((child) => __awaiter(this, void 0, void 0, function* () {
                                return yield guild.channels.create({
                                    name: child.name,
                                    parent: parent.id,
                                    topic: child.topic,
                                    position: child.position,
                                    type: child.type,
                                    permissionOverwrites: child.permissions,
                                });
                            }));
                        }));
                    }
                    else {
                        return yield guild.channels.create({
                            name: channel.name,
                            topic: channel.topic,
                            position: channel.position,
                            type: channel.type,
                            permissionOverwrites: channel.permissions,
                        });
                    }
                })));
                yield Promise.all(backupData.roles.sort((a, b) => b.position - a.position).map((role) => __awaiter(this, void 0, void 0, function* () {
                    return yield guild.roles.create({
                        name: role.name,
                        position: role.position,
                        // @ts-ignore
                        permissions: new discord_js_1.PermissionsBitField(role.permissions),
                        color: role.color,
                        mentionable: role.mentionable,
                    });
                })));
                backupData.bans.forEach(ban => {
                    guild.bans.create(ban.userId, { reason: ban.reason }).catch();
                });
                yield interaction.editReply({
                    embeds: [
                        new discord_js_1.EmbedBuilder()
                            .setTitle("Le serveur à été créer avec succès !")
                            .setColor(Embed_1.DiscordColor.Eagle)
                            // @ts-ignore
                            .setDescription(`[rejoindre le serveur](${yield guild.invites.create(guild.channels.cache.filter(x => x.type == discord_js_1.ChannelType.GuildText).first())})`)
                            .setTimestamp()
                            .setFooter({ text: `Le serveur sera supprimé si tu ne rejoins pas dans les 2 prochaines minutes` })
                    ]
                });
                function OwnerAdd(stop = false) {
                    if (stop)
                        return;
                    client.once("guildMemberAdd", (member) => {
                        if (member.guild.id != guild.id)
                            return OwnerAdd();
                        if (member.id == backupData.guild.ownerId)
                            guild.setOwner(member);
                        else
                            OwnerAdd();
                    });
                }
                OwnerAdd();
                setTimeout(() => {
                    if (guild.ownerId == client.user.id)
                        guild.delete();
                    OwnerAdd(true);
                }, 5 * 60 * 1000);
            }));
        });
    },
    delete(interaction, client) {
        const name = interaction.options.getString("nom");
        client.managers.backupManager.getIfExist(`${interaction.user.id}-${name}`).delete();
        interaction.reply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setTitle(`La Backup ${name} a été supprimée avec succès !`)
                    .setColor(Embed_1.DiscordColor.Aqua)
            ],
            ephemeral: true
        });
    },
    list(interaction, client) {
        const backupData = client.managers.backupManager;
        const name = backupData.map(x => x.name);
        if (name.length == 0)
            return interaction.reply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor("Red")
                        .setDescription("Vous n'avez aucune backup !")
                ],
                ephemeral: true
            });
        const value = backupData.map(x => {
            var _a, _b, _c, _d, _e, _f, _g;
            return `
        Backup du serveur: \`${(_a = x.guild) === null || _a === void 0 ? void 0 : _a.name}\`
        OwnerId: \`${(_b = x.guild) === null || _b === void 0 ? void 0 : _b.ownerId}\`
        Channels: \`${(_c = x.channels) === null || _c === void 0 ? void 0 : _c.length}\`
        Roles: \`${(_d = x.roles) === null || _d === void 0 ? void 0 : _d.length}\`
        Emojis: \`${(_e = x.emojis) === null || _e === void 0 ? void 0 : _e.length}\`
        Stickers: \`${(_f = x.stickers) === null || _f === void 0 ? void 0 : _f.length}\`
        Bans: \`${(_g = x.stickers) === null || _g === void 0 ? void 0 : _g.length}\``;
        });
        const Embed = new discord_js_1.EmbedBuilder()
            .setTitle(`Liste de vos ${name.length} Backups !`)
            .setColor("DarkGold");
        if (name.length > 25) {
            client.func.utils.pagination(Embed, name, value, interaction);
        }
        else {
            interaction.reply({
                embeds: [
                    Embed.setFields([...Array(name.length).keys()].map(i => {
                        return {
                            name: name[i],
                            value: value[i]
                        };
                    }))
                ]
            });
        }
    },
};
