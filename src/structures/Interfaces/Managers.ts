import {EmbedData, PermissionsBitField } from "discord.js";
import Manager from "../Managers/main";

export default interface ModelTypes {
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
        [key: string]: EmbedData
    }
}

export interface Lastname {
    userId: string
    namelist?: string[]
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
    data?: {
        channels: string[],
        roles: string[],
        emojis: string[],
        stickers: string[],
        bans: string[],
    }
}

export interface Blacklist {
    userId: string,
    authorId?: string,
    reason?: string,
}

export interface Guilds {
    guildId: string,
    lang?: "fr" | "en",
    autoreply?: Array<{question: string, reponse: string}>,
    antiLink?: {
        roleMini: string,
        active: boolean,
        type: string,
    },
    logs?: {
        enable: {
            ApplicationCommandPermissionUpdate: boolean,
            autoModerationActionExecution: boolean,
            AutoModerationRuleUpdate: boolean,
            botAdd: boolean,
            ChannelCreate: boolean,
            channelDelete: boolean,
            ChannelUpdate: boolean,
            EmojiCreate: boolean,
            EmojiDelete: boolean,
            EmojiUpdate: boolean,
            GuildUpdate: boolean,
            InviteCreate: boolean,
            InviteDelete: boolean,
            MemberBanAdd: boolean,
            MemberBanRemove: boolean,
            MemberKick: boolean,
            MessageDelete: boolean,
            MessagePin: boolean,
            MessageUnpin: boolean,
            RoleCreate: boolean,
            RoleDelete: boolean,
            StickerCreate: boolean,
            StickerDelete: boolean,
            ThreadCreate: boolean,
            ThreadDelete: boolean,
            WebhookCreate: boolean,
            WebhookDelete: boolean,
            warn: boolean,
        },
        channel: {
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
            warn: string,
        }
    },
    permissions?: {
        calc: PermissionsBitField
    }
    form?: {
        [key: string]: Array<{
            question: string,
            style: number,
            required: boolean,
            max: number,
            min: number,
        }>
    },
    muteRoleId?: string,
    autoRoles?: Array<string>,
    join?: {
        channelId: string,
        message: {
            embed: EmbedData,
            content: string,
        }
    },
    leave?: {
        channelId: string,
        message: {
            embed: EmbedData,
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