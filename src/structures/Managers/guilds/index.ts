import { EagleDatabaseSqlite } from "../../DataBase";
import { PermissionsBitField } from "discord.js";

export default function (database: EagleDatabaseSqlite, modelName: string) {
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
                    enable: {
                        ApplicationCommandPermissionUpdate: false,
                        autoModerationActionExecution: false,
                        AutoModerationRuleUpdate: false,
                        botAdd: false,
                        ChannelCreate: false,
                        channelDelete: false,
                        ChannelUpdate: false,
                        EmojiCreate: false,
                        EmojiDelete: false,
                        EmojiUpdate: false,
                        GuildUpdate: false,
                        InviteCreate: false,
                        InviteDelete: false,
                        MemberBanAdd: false,
                        MemberBanRemove: false,
                        MemberKick: false,
                        MessageDelete: false,
                        MessagePin: false,
                        MessageUnpin: false,
                        RoleCreate: false,
                        RoleDelete: false,
                        StickerCreate: false,
                        StickerDelete: false,
                        ThreadCreate: false,
                        ThreadDelete: false,
                        WebhookCreate: false,
                        WebhookDelete: false,
                        warn: false,
                    },
                    channel: {
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
                        warn: null,
                    }
                }
            },
            {
                name: 'permissions',
                type: DataTypes.JSON,
                allowNull: false,
                isValue: true,
                default: {
                    calc: Number(PermissionsBitField.Flags.ManageGuild),
                    kick: Number(PermissionsBitField.Flags.KickMembers),
                    vkick: Number(PermissionsBitField.Flags.MoveMembers),
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
                name: 'member',
                type: DataTypes.STRING(25),
                allowNull: true,
                isValue: true,
            },
            {
                name: 'mute',
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