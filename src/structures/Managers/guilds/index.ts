import { EagleDatabaseSqlite } from "../../DataBase";
import { PermissionsBitField } from "discord.js";

export default function (database: EagleDatabaseSqlite, modelName: string): Promise<Array<{name: string, type: any, allowNull?: boolean, isValue?: boolean, isWhere?: boolean, primaryKey?: boolean, default?: any}>> {
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
                    AutoModerationBlockMessage: null,
                    AutoModerationFlagToChannel: null,
                    AutoModerationRuleCreate: null,
                    AutoModerationRuleDelete: null,
                    AutoModerationRuleUpdate: null,
                    AutoModerationUserCommunicationDisabled: null,
                    BotAdd: null,
                    ChannelCreate: null,
                    ChannelDelete: null,
                    ChannelOverwriteCreate: null,
                    ChannelOverwriteDelete: null,
                    ChannelOverwriteUpdate: null,
                    ChannelUpdate: null,
                    EmojiCreate: null,
                    EmojiDelete: null,
                    EmojiUpdate: null,
                    GuildScheduledEventCreate: null,
                    GuildScheduledEventDelete: null,
                    GuildScheduledEventUpdate: null,
                    GuildUpdate: null,
                    IntegrationCreate: null,
                    IntegrationDelete: null,
                    IntegrationUpdate: null,
                    InviteCreate: null,
                    InviteDelete: null,
                    InviteUpdate: null,
                    MemberBanAdd: null,
                    MemberBanRemove: null,
                    MemberDisconnect: null,
                    MemberKick: null,
                    MemberMove: null,
                    MemberPrune: null,
                    MemberRoleUpdate: null,
                    MemberUpdate: null,
                    MessageBulkDelete: null,
                    MessageDelete: null,
                    MessagePin: null,
                    MessageUnpin: null,
                    RoleCreate: null,
                    RoleDelete: null,
                    RoleUpdate: null,
                    StageInstanceCreate: null,
                    StageInstanceDelete: null,
                    StageInstanceUpdate: null,
                    StickerCreate: null,
                    StickerDelete: null,
                    StickerUpdate: null,
                    ThreadCreate: null,
                    ThreadDelete: null,
                    ThreadUpdate: null,
                    WebhookCreate: null,
                    WebhookDelete: null,
                    WebhookUpdate: null,
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
                    calc: Number(PermissionsBitField.Flags.UseApplicationCommands),
                    lastname: Number(PermissionsBitField.Flags.UseApplicationCommands),
                    kick: Number(PermissionsBitField.Flags.KickMembers),
                    ban: Number(PermissionsBitField.Flags.BanMembers),
                    unban: Number(PermissionsBitField.Flags.BanMembers),
                    "ban-list": Number(PermissionsBitField.Flags.BanMembers),
                    "unban-all": "whitelist",
                    vkick: Number(PermissionsBitField.Flags.MoveMembers),
                    warn: Number(PermissionsBitField.Flags.ModerateMembers),
                    unwarn: Number(PermissionsBitField.Flags.ModerateMembers),
                    "userinfo": Number(PermissionsBitField.Flags.UseApplicationCommands),
                    clear: Number(PermissionsBitField.Flags.ManageMessages),
                    "clear-user": Number(PermissionsBitField.Flags.ManageMessages),
                    "clear-channel": Number(PermissionsBitField.Flags.ManageChannels),
                    lock: Number(PermissionsBitField.Flags.ManageChannels),
                    unlock: Number(PermissionsBitField.Flags.ManageChannels),
                    show: Number(PermissionsBitField.Flags.ManageChannels),
                    hide: Number(PermissionsBitField.Flags.ManageChannels),
                    "move-all": Number(PermissionsBitField.Flags.Administrator),
                    mute: Number(PermissionsBitField.Flags.MuteMembers),
                    unmute: Number(PermissionsBitField.Flags.MuteMembers),
                    slowmode: Number(PermissionsBitField.Flags.ManageChannels),
                    help: Number(PermissionsBitField.Flags.UseApplicationCommands),
                    owner: "owner",
                    unowner: "owner",
                    "owner-list": "owner",
                    wl: "owner",
                    unwl: "owner",
                    "wl-list": "owner",
                    "commands-perms": "owner",
                    config: "owner",
                    "guild-list": "owner",
                    logs: Number(PermissionsBitField.Flags.Administrator),
                    autoroles: Number(PermissionsBitField.Flags.Administrator),
                    "add-buttonlink": Number(PermissionsBitField.Flags.Administrator),
                    backup: Number(PermissionsBitField.Flags.Administrator),
                    moveall: Number(PermissionsBitField.Flags.Administrator),
                    "copy-emoji": Number(PermissionsBitField.Flags.Administrator),
                    formulaire: Number(PermissionsBitField.Flags.Administrator),
                    "presence-role": Number(PermissionsBitField.Flags.Administrator),
                    "greet-ping": Number(PermissionsBitField.Flags.Administrator),
                    ticket: Number(PermissionsBitField.Flags.Administrator),
                    autoreply: Number(PermissionsBitField.Flags.Administrator),
                    join: Number(PermissionsBitField.Flags.Administrator),
                    leave: Number(PermissionsBitField.Flags.Administrator),
                    bl: "whitelist",
                    unbl: "whitelist",
                    "bl-list": "whitelist",
                    "role-everyone": "whitelist",
                    "guild-leave": "owner",
                    modmail: "owner",
                    anti: "owner",
                    protect: "owner",
                    "embeds": Number(PermissionsBitField.Flags.Administrator),
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
        ]
        const t = {};
        data.forEach(y => {
            t[y.name] = y;
        })

        try {
            database.define(modelName, t, {
                timestamps: false,
                tableName: modelName,
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci'
            }).sync({alter: true}).then(() => {
                resolve(data);
            }).catch(reject);
        } catch (e) {
            reject(e);
        }

    })
}