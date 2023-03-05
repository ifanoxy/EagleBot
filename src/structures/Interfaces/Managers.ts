import {APIEmbed, EmbedData, PermissionOverwrites, PermissionsBitField} from "discord.js";
import Manager from "../Managers/main";
import {CommandsType} from "../Enumerations/CommandType";

export interface ModelTypes {
    guildsManager: Manager<Guilds>
    antiraidManager: Manager<Antiraid>
    backupManager: Manager<Backup>
    lastnameManager: Manager<Lastname>
    membersManager: Manager<Members>
    muteManager: Manager<Mute>
    ownerManager: Manager<Owner>
    statsManager: Manager<Stats>
    ticketsManager: Manager<Tickets>
    whitelistManager: Manager<Whitelist>
    blacklistManager: Manager<Blacklist>
}

export interface Whitelist {
    userId: string,
    authorId?: string,
    reason?: string,
}

export interface Tickets {
    userId: string,
    data?: object,
}

export interface Stats {
    guildId: string,
    data?: object,
}

export interface Owner {
    userId: string
}

export interface Mute {
    guildId: string,
    memberId: string,
    expiredAt?: number,
    createdAt?: number,
    reason?: string,
    authorId?: string,
}

export interface Members {
    memberId: string,
    moderation?: {
        kick: number,
        ban: number,
        removedMessage: number,
        warn: number,
        mute: number,
    },
    warn?: Array<{userId: string, reason: string, date: Date}>,
    embeds?: {
        [key: string]: APIEmbed
    }
}

export interface Lastname {
    userId: string
    namelist?: Array<Array<string | number>>
}

export interface Antiraid {
    guildId: string,
    status?: {
        "anti-bot": {
            status: boolean,
            ignoreWhitelist: boolean,
            sanction: string,
        },
        "anti-massChannel": {
            create: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
            delete: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
            update: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
        },
        "anti-massRole": {
            create: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
            delete: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
            update: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
        },
        "anti-massBan": {
            status: boolean,
            frequence: string,
            ignoreWhitelist: boolean,
            sanction: string,
        },
        "anti-massUnban": {
            status: boolean,
            frequence: string,
            ignoreWhitelist: boolean,
            sanction: string,
        },
        "anti-massKick": {
            status: boolean,
            frequence: string,
            ignoreWhitelist: boolean,
            sanction: string,
        },
        "anti-massSticker": {
            create: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
            delete: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
            update: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
        },
        "anti-massEmoji": {
            create: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
            delete: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
            update: {
                status: boolean,
                frequence: string,
                ignoreWhitelist: boolean,
                sanction: string,
            },
        },
        "anti-newAccount": {
            status: boolean,
            ageMin: string,
        },
        "anti-webhook": {
            status: boolean,
            ignoreWhitelist: boolean,
            sanction: string,
        },
        "anti-roleAdmin": {
            status: boolean,
            ignoreWhitelist: boolean,
            sanction: string,
        },
    },
    log: string,
}

export interface Backup {
    userId: string,
    name: string,
    guild?: {
        name: string,
        ownerId: string,
        iconURL?: string,
    }
    channels?: {
        name: string,
        type: number,
        id: string,
        topic?: string,
        position: number,
        permissions: PermissionOverwrites[],
        children?: {
            name: string,
            type: number,
            id: string,
            topic?: string,
            position: number,
            permissions: PermissionOverwrites[]
        }[]
    }[],
    roles?: {
        name: string,
        id: string,
        color: number,
        position: number,
        icon: string,
        permissions: string,
        mentionable: boolean
    }[],
    emojis?: {
        name: string,
        url:string
    }[],
    stickers?: {
        name: string,
        description: string,
        url: string,
        tags: string,
    }[],
    bans?: {
        userId: string,
        reason: string,
    }[],
}

export interface Blacklist {
    userId: string,
    authorId?: string,
    reason?: string,
}

export interface Guilds {
    guildId: string,
    prefix?: string,
    commandType?: CommandsType,
    lang?: "fr" | "en",
    autoreply?: Array<{question: string, reponse: string}>,
    antiLink?: {
        roleMini: string,
        active: boolean,
        type: string,
    },
    logs?: {
        ApplicationCommandPermissionUpdate: string,
        autoModerationActionExecution: string,
        AutoModerationRuleUpdate: string,
        botAdd: string,
        ChannelCreate: string,
        channelDelete: string,
        ChannelUpdate: string,
        EmojiCreate: string,
        EmojiDelete: string,
        EmojiUpdate: string,
        GuildUpdate: string,
        InviteCreate: string,
        InviteDelete: string,
        MemberBanAdd: string,
        MemberBanRemove: string,
        MemberKick: string,
        MessageDelete: string,
        MessagePin: string,
        MessageUnpin: string,
        RoleCreate: string,
        RoleDelete: string,
        StickerCreate: string,
        StickerDelete: string,
        ThreadCreate: string,
        ThreadDelete: string,
        WebhookCreate: string,
        WebhookDelete: string,
        AdminRolesAdd: string,
        BotCommands: string,
        WhiteListUpdate: string,
        BlackListUpdate: string,
        OwnerUpdate: string,
        Warn: string,
        Mute: string,
    },
    permissions?: {
        [key: string]: number | string,
    }
    form?: {
        [key: string]: {
            channel: string,
            data:
                Array<{
                    question: string,
                    style: number,
                    required: boolean,
                    max: number,
                    min: number,
                }>
        }
    },
    muteRoleId?: string,
    autoroles?: Array<string>,
    join?: {
        channelId: string,
        message: {
            embed: APIEmbed,
            content: string,
        }
    },
    leave?: {
        channelId: string,
        message: {
            embed: APIEmbed,
            content: string,
        }
    },
    greetPing?: {
        status: boolean,
        channels: Array<string>
    },
    presenceRole?: {
        roleId: string,
        presence: string,
        type: "includes" | "equals"
    }
}