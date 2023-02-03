module.exports = function (database, modelName, config) {
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
                name: 'antiraid',
                type: DataTypes.JSON,
                allowNull: true,
                isValue: true,
                default: {
                    enable: {
                        webhookUpdate: false,
                        roleCreate: false,
                        roleUpdate: false,
                        roleDelete: false,
                        channelCreate: false,
                        channelUpdate: false,
                        channelDelete: false,
                        antiSpam: false,
                        antiMassBan: false,
                        antiBot: false,
                        roleAdd: false,
                        antiLink: false,
                        antiMassKick: false,
                        antiDc: false,
                        nameUpdate: false,
                        vanityUpdate: false,
                        antiToken: false,
                        antiMassMention: false,
                    },
                    config: {
                        webhookUpdate: 'unrank',
                        roleCreate: 'unrank',
                        roleUpdate: 'unrank',
                        roleDelete: 'unrank',
                        channelCreate: 'unrank',
                        channelUpdate: 'unrank',
                        channelDelete: 'unrank',
                        antiSpam: 'unrank',
                        antiMassBan: 'unrank',
                        antiBot: 'unrank',
                        roleAdd: 'unrank',
                        antiLink: 'unrank',
                        antiMassKick: 'unrank',
                        antiDc: 'kick',
                        nameUpdate: 'unrank',
                        vanityUpdate: 'unrank',
                        antiToken: 'kick',
                        antiMassMention: 'kick',
                    },
                    limit: {
                        antiMassBan: '3/10s',
                        antiMassKick: '2/10s',
                        antiDc: '1d',
                        antiLink: '2/10s',
                        antiToken: '10/1Os',
                        antiMassMention: '10/10s',
                    },
                    activeLimits: {
                        antiToken: {recentJoined: [], counter: 0}
                    },
                    channelBypass: {
                        webhookUpdate: [],
                        roleCreate: [],
                        roleUpdate: [],
                        roleDelete: [],
                        channelCreate: [],
                        channelUpdate: [],
                        channelDelete: [],
                        antiSpam: [],
                        antiMassBan: [],
                        antiBot: [],
                        roleAdd: [],
                        antiLink: [],
                        antiMassKick: [],
                        antiDc: [],
                        nameUpdate: [],
                        vanityUpdate: [],
                        antiToken: [],
                        antiMassMention: [],
                    }

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
                name: 'setup',
                type: DataTypes.BOOLEAN,
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
              name: 'embedColor',
              isValue: true,
              type: DataTypes.JSON,
              allowNull: true,
              default: "#36393E"
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