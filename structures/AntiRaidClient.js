const { Client, Collection, Guild, User, Member } = require("eris");
const config = require("../config");
const chalk = require("chalk");
const { EagleDatabaseSqlite } = require("./DataBase");
const { Manager } = require("./Managers/main");
const { AntiraidHandler } = require("./Handler/AntiraidHandler");
const { EmbedBuilder } = require("@discordjs/builders");

class AntiRaidClient extends Client {
    constructor(client) {
        super(config.discord.token, {
            autoreconnect: true,
            compress: false,
            intents: ["guilds", "guildBans", "guildWebhooks", "guildMessages", "guildMembers", "directMessages", "guildEmojisAndStickers"],
        });
        this.client = client
        this.Collection = Collection;
        this._fs = require("fs");
        this.log("Lancement de l'anti raid", chalk.yellow);
        this.config = require('../config');
        this.database = new EagleDatabaseSqlite(this);
        this.database.auth().then(() => {
            this.actualModelLoad = 0;
            this.log("Database connection...",  chalk.blue)
            this["antiraid"] = new Manager(this, "antiraid");
            delete require.cache[require.resolve("./Managers/main")];
        });
    }

    startHandler() {
        this.connect();
        this.handler = new AntiraidHandler(this)
    }

    log(msg, color = chalk.blue) {
        console.log(chalk.bold.green("[Eagle BOT - Anti Raid]")+ color(msg))
    }

    /**
     * 
     * @param {Guild} guild 
     */
    ping(guild) {
        if (guild.shard.latency == Infinity) {
            return this.client.ws.ping - Math.floor( Math.random() * (9 - 2) + 2 )
        } else {
            return guild.shard.latency
        }
    }

    /**
     * 
     * @param {User} userId 
     */
    isWhitelist(userId) {
        const whitelistData = this.client.managers.whitelistsManager.getIfExist(userId);
        if (whitelistData)return true;
        return false;
    }

    /**
     * 
     * @param {User} userId 
     * @returns 
     */
    isOwner(userId) {
        const ownerData = this.client.managers.ownerManager.getIfExist(userId);
        if (userId == this.client.config.ownerId)return true;
        if (ownerData)return true;
        return false;
    }

    /**
     * 
     * @param {Member} member
     * @param {"ban" | "kick" | "derank"} sanction
     * @param {import("discord.js").Snowflake | undefined} logChannelId
     * @param {Number} execTime
     */
    applySanction(member, sanction, logChannelId, execTime, type) {
        switch (sanction) {
            case "ban" : {
                member.user.getDMChannel()
                .then(channel => {
                    channel.createMessage({
                        embeds: [
                            {
                                title: `Vous avez été banni par l'anti raid du serveur ${member.guild.name} !\n\nRaison: \`${type}\``,
                                color: 14592837,
                            }
                        ]
                    })
                    .then(() => {
                        member.ban(null, "Anti Raid").then(() => {
                            if (!logChannelId)return;
                            member.guild.channels.get(logChannelId).createMessage({
                                embeds: [
                                    {
                                        title: "Anti Raid - Bannissement",
                                        description: `Le membre <@${member.id}> à été banni du serveur par l'anti raid\n\nRaison: \`${type}\``,
                                        color: 14592837,
                                        footer: {
                                            text: `Action effectué en ${execTime}ms`
                                        }
                                    }
                                ]
                            });
                        });
                    });
                }).catch(() => {
                    member.ban(null, "Anti Raid").then(() => {
                        if (!logChannelId)return;
                        member.guild.channels.get(logChannelId).createMessage({
                            embeds: [
                                {
                                    title: "Anti Raid - Bannissement",
                                    description: `Le membre <@${member.id}> à été banni du serveur par l'anti raid\n\nRaison: \`${type}\``,
                                    color: 14592837,
                                    footer: {
                                        text: `Action effectué en ${execTime}ms`
                                    }
                                }
                            ]
                        });
                    });
                });
            }break;
            case "derank" : {
                member.user.getDMChannel()
                .then(channel => {
                    channel.createMessage({
                        embeds: [
                            {
                                title: `Vous avez été derank par l'anti raid du serveur ${member.guild.name} !\n\nRaison: \`${type}\``,
                                color: 14592837,
                            }
                        ]
                    })
                    .then(() => {
                        member.roles.map(role => {
                            member.removeRole(role, "Anti Raid").catch(() => {})
                        })
                        if (!logChannelId)return;
                        member.guild.channels.get(logChannelId).createMessage({
                            embeds: [
                                {
                                    title: "Anti Raid - Derank",
                                    description: `Le membre <@${member.id}> à été derank du serveur par l'anti raid\n\nRaison: \`${type}\``,
                                    color: 14592837,
                                    footer: {
                                        text: `Action effectué en ${execTime}ms`
                                    }
                                }
                            ]
                        })
                    })
                }).catch(() => {
                    member.roles.map(role => {
                        member.removeRole(role.id, "Anti Raid").catch(() => {})
                    })
                    if (!logChannelId)return;
                    member.guild.channels.get(logChannelId).createMessage({
                        embeds: [
                            {
                                title: "Anti Raid - Derank",
                                description: `Le membre <@${member.id}> à été derank du serveur par l'anti raid\n\nRaison: \`${type}\``,
                                color: 14592837,
                                footer: {
                                    text: `Action effectué en ${execTime}ms`
                                }
                            }
                        ]
                    })
                })
            }break;
            case "kick" : {
                member.user.getDMChannel()
                .then(channel => {
                    channel.createMessage({
                        embeds: [
                            {
                                title: `Vous avez été kick par l'anti raid du serveur ${member.guild.name} !\n\nRaison: \`${type}\``,
                                color: 14592837,
                            }
                        ]
                    })
                    .then(() => {
                        member.kick(null, "Anti Raid").then(() => {
                            if (!logChannelId)return;
                            member.guild.channels.get(logChannelId).createMessage({
                                embeds: [
                                    {
                                        title: "Anti Raid - Kick",
                                        description: `Le membre <@${member.id}> à été kick du serveur par l'anti raid\n\nRaison: \`${type}\``,
                                        color: 14592837,
                                        footer: {
                                            text: `Action effectué en ${execTime}ms`
                                        }
                                    }
                                ]
                            });
                        });
                    })
                }).catch(() => {
                    member.kick(null, "Anti Raid").then(() => {
                        if (!logChannelId)return;
                        member.guild.channels.get(logChannelId).createMessage({
                            embeds: [
                                {
                                    title: "Anti Raid - Kick",
                                    description: `Le membre <@${member.id}> à été kick du serveur par l'anti raid\n\nRaison: \`${type}\``,
                                    color: 14592837,
                                    footer: {
                                        text: `Action effectué en ${execTime}ms`
                                    }
                                }
                            ]
                        });
                    });
                })
            }break;
        }
    }
}

module.exports = { AntiRaidClient }