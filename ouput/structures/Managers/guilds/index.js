"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
function default_1(database, modelName) {
    return new Promise((resolve, reject) => {
        const DataTypes = database.DataTypes;
        const data = [
            {
                name: "guildId",
                type: DataTypes.STRING(25),
                allowNull: false,
                primaryKey: true,
                isWhere: true
            },
            {
                name: "lang",
                type: DataTypes.STRING(2),
                allowNull: false,
                isValue: true,
                default: "fr"
            },
            {
                name: "prefix",
                type: DataTypes.STRING(5),
                allowNull: false,
                isValue: true,
                default: "&"
            },
            {
                name: "commandType",
                type: DataTypes.INTEGER,
                allowNull: false,
                isValue: true,
                default: 1
            },
            {
                name: 'reactroles',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: []
            },
            {
                name: 'autoreply',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: []
            },
            {
                name: 'anti',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: {
                    link: {
                        roleMini: null,
                        active: false,
                        type: null,
                    },
                    spam: null,
                }
            },
            {
                name: 'logs',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: {
                    ApplicationCommandPermissionUpdate: null,
                    autoModerationActionExecution: null,
                    AutoModerationRuleUpdate: null,
                    botAdd: null,
                    ChannelCreate: null,
                    channelDelete: null,
                    ChannelUpdate: null,
                    EmojiCreate: null,
                    EmojiDelete: null,
                    EmojiUpdate: null,
                    GuildUpdate: null,
                    InviteCreate: null,
                    InviteDelete: null,
                    MemberBanAdd: null,
                    MemberBanRemove: null,
                    MemberKick: null,
                    MessageDelete: null,
                    MessagePin: null,
                    MessageUnpin: null,
                    RoleCreate: null,
                    RoleDelete: null,
                    StickerCreate: null,
                    StickerDelete: null,
                    ThreadCreate: null,
                    ThreadDelete: null,
                    WebhookCreate: null,
                    WebhookDelete: null,
                    AdminRolesAdd: null,
                    BotCommands: null,
                    WhiteListUpdate: null,
                    BlackListUpdate: null,
                    OwnerUpdate: null,
                    Warn: null,
                    Mute: null,
                }
            },
            {
                name: 'permissions',
                type: DataTypes.JSON,
                allowNull: false,
                isValue: true,
                default: {
                    calc: Number(discord_js_1.PermissionsBitField.Flags.UseApplicationCommands),
                    lastname: Number(discord_js_1.PermissionsBitField.Flags.UseApplicationCommands),
                    kick: Number(discord_js_1.PermissionsBitField.Flags.KickMembers),
                    ban: Number(discord_js_1.PermissionsBitField.Flags.BanMembers),
                    unban: Number(discord_js_1.PermissionsBitField.Flags.BanMembers),
                    "ban-list": Number(discord_js_1.PermissionsBitField.Flags.BanMembers),
                    "unban-all": "whitelist",
                    vkick: Number(discord_js_1.PermissionsBitField.Flags.MoveMembers),
                    warn: Number(discord_js_1.PermissionsBitField.Flags.ModerateMembers),
                    unwarn: Number(discord_js_1.PermissionsBitField.Flags.ModerateMembers),
                    "userinfo": Number(discord_js_1.PermissionsBitField.Flags.UseApplicationCommands),
                    clear: Number(discord_js_1.PermissionsBitField.Flags.ManageMessages),
                    "clear-user": Number(discord_js_1.PermissionsBitField.Flags.ManageMessages),
                    "clear-channel": Number(discord_js_1.PermissionsBitField.Flags.ManageChannels),
                    lock: Number(discord_js_1.PermissionsBitField.Flags.ManageChannels),
                    unlock: Number(discord_js_1.PermissionsBitField.Flags.ManageChannels),
                    show: Number(discord_js_1.PermissionsBitField.Flags.ManageChannels),
                    hide: Number(discord_js_1.PermissionsBitField.Flags.ManageChannels),
                    "move-all": Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    mute: Number(discord_js_1.PermissionsBitField.Flags.MuteMembers),
                    unmute: Number(discord_js_1.PermissionsBitField.Flags.MuteMembers),
                    slowmode: Number(discord_js_1.PermissionsBitField.Flags.ManageChannels),
                    help: Number(discord_js_1.PermissionsBitField.Flags.UseApplicationCommands),
                    owner: "owner",
                    unowner: "owner",
                    "owner-list": "owner",
                    wl: "owner",
                    unwl: "owner",
                    "wl-list": "owner",
                    "commands-perms": "owner",
                    config: "owner",
                    "guild-list": "owner",
                    logs: Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    autoroles: Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    "add-buttonlink": Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    backup: Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    moveall: Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    "copy-emoji": Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    formulaire: Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    "presence-role": Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    "greet-ping": Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    ticket: Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    autoreply: Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    join: Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    leave: Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                    bl: "whitelist",
                    unbl: "whitelist",
                    "bl-list": "whitelist",
                    "role-everyone": "whitelist",
                    "guild-leave": "owner",
                    modmail: "owner",
                    anti: "owner",
                    protect: "owner",
                    "embeds": Number(discord_js_1.PermissionsBitField.Flags.Administrator),
                },
            },
            {
                name: 'form',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: {},
            },
            {
                name: 'muteRoleId',
                type: DataTypes.STRING(25),
                allowNull: true,
                isValue: true,
            },
            {
                name: 'autoroles',
                isValue: true,
                type: DataTypes.JSON,
                allowNull: true,
                default: []
            },
            {
                name: 'join',
                isValue: true,
                type: DataTypes.JSON,
                allowNull: true,
                default: {
                    channelId: null,
                    message: {
                        content: null,
                        embed: null,
                    }
                }
            },
            {
                name: 'leave',
                isValue: true,
                type: DataTypes.JSON,
                allowNull: true,
                default: {
                    channelId: null,
                    message: {
                        content: null,
                        embed: null,
                    }
                }
            },
            {
                name: 'greetPing',
                isValue: true,
                type: DataTypes.JSON,
                allowNull: true,
                default: {
                    status: false,
                    channels: []
                }
            },
            {
                name: 'presenceRole',
                isValue: true,
                type: DataTypes.JSON,
                allowNull: true,
                default: {
                    roleId: null,
                    presence: null,
                    type: null
                }
            },
        ];
        const t = {};
        data.forEach(y => {
            t[y.name] = y;
        });
        try {
            database.define(modelName, t, {
                timestamps: false,
                tableName: modelName,
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }).sync({ alter: true }).then(() => {
                resolve(data);
            }).catch(reject);
        }
        catch (e) {
            reject(e);
        }
    });
}
exports.default = default_1;
