import {
    Client,
    Partials,
    Collection,
    ChatInputCommandInteraction,
    PermissionsBitField, ChannelType, ForumChannel, EmbedBuilder,
} from "discord.js";
import Config from "./Interfaces/config"
import { EagleHandler } from "./Handler/EagleHandler";
import {EagleDatabaseMysql} from "./DataBase";
import EagleManagers from "./Managers";
import chalk from "chalk";
import * as fs from "fs";
import Functions from "../functions/main";

export {};

declare global {
    interface String {
        replaceArray(find: Array<string>, replace: Array<string>): string;
    }
}

import {Webhook} from "@top-gg/sdk"
import express from "express"
import {DiscordColor} from "./Enumerations/Embed";

const app = express()

const webhook = new Webhook('12a.69ZazdAIHUEOAZJiouhazd&iazudhIUihIUJ75H')

app.listen(25844)

String.prototype.replaceArray = function(find, replace) {
    var replaceString = this;
    var regex;
    for (var i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g");
        replaceString = replaceString.replace(regex, replace[i]);
    }
    return replaceString;
};


export class EagleClient extends Client {
    Collection: typeof Collection;
    _fs: typeof fs;
    config: Config;
    database: EagleDatabaseMysql;
    managers: EagleManagers;
    handlers: EagleHandler;
    func: Functions;

    constructor() {
        super({
            closeTimeout: 7 * 1000,
            intents: 3276799,
            partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User],
        });
        app.post('/dblwebhook', webhook.listener(vote => {
            this.channels.fetch("1072128486900240486")
                .then(channel => {
                    let memberData = this.managers.membersManager.getAndCreateIfNotExists(vote.user, {memberId: vote.user, vote: 0})
                    //@ts-ignore
                    channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(DiscordColor.Eagle)
                                .setTitle(`Merci du vote !`)
                                .setDescription(`<@${vote.user}> vient de voter, c'est son \`${Number(memberData.vote)+1}\` votes !`)
                                .setTimestamp()
                        ]
                    })
                    memberData.vote += 1;
                    memberData.save().catch(console.log)
                })
                .catch()
        }))
        process.on("uncaughtException", (error, origin) => this.error(error))
        process.on("unhandledRejection", (error, origin) => this.error(error))
        process.on("uncaughtExceptionMonitor", (error) => this.error(error))
        this.config = require("../config.json");
        console.log(`\n                               ::\n                               ?PJ~:.\n                               ~BBBG5?~:.\n                                7GBBBBBGPY?!^..      .........\n                             ?!. ^YBBBBBBBBBBP5J!^:.     ..:^~~~~:.\n                            .PB5!:.^?PBBBBBBBBBBBBG5J!^.       .^!??7^.\n                             7BBBGY?!!?YGBBBBBBBBBBBBBBPY?~:       :!JYJ!:\n                             .7GBBBBBBBBBBBBBBBBBBBBBBBBBBBGY7^.!^.   :75PJ~.\n                               ^JGBBBBBBBBBBBBBBBBBBBBBBBBBBBBB5GBY~.   .!5BP7:\n                            :^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBY:    .!PBP?:\n                        .^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBJ7J5GBBBBBBP^     :JBBP7.\n                     .^75GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBY~.:~?5GBBB5.     .7GBB5^\n                   .!YGBBBBBBBBBBBBBBGGGBBBBBBBBBBBBBBBBBBBBB5?~^:^7YPP:       ~GBBG7.\n                 .!5BBBBBBBBBBBBG5J?J5GBBBBBBBBBBBBBBBBBBBBBBBBBGGPYJ7~:        ~GBBBJ.\n                ~5BBBBBBBBBBBGJ!^7YGBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBPJ!:      7BBBBY.\n              :JBBBBBBBBBBBP7::7PBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBP?^    .YBBBBJ.\n             ^5BBBBBBBBBBG7..!PBBBBBBBBBBBBBBBBBBBBGGP555555PPGGBBBBBBBBBBBBG7.   ~BBBBB7\n            ~PBBBBBBBBBBY: .JBBBBBBBBBBBBBBBBBGY?!^:..... ....::^~7?YPGBBBBBBB?   .PBBBBG^\n           ^GBBBBBBBBBBJ. .YBBBBBBBBBBBBBBBGJ~:                      .:!?5BBBBP.   JBBBBBY\n          :5BBBBBBBBBBJ. .JBBBBBBBBBBBBBBGJ:                             .^JGBY    ?BBBBBG^\n          ?BBBBBBBBBB5.  ~BBBBBBBBBBBBBBP~                                  ~J:    ?BBBBBB7\n         :GBBBBBBBBBB~  .YBBBBBBBBBBBBBP^                                          YBBBBBBJ\n         !BBBBBBBBBBP.  :GBBBBBBBBBBBBB!                                          .PBBBBBBY\n         JBBBBBBBBBBY   ^BBBBBBBBBBBBB5.                                          !BBBBBBBY\n         YBBBBBBBBBBJ   :GBBBBBBBBBBBB?                                          .5BBBBBBB?\n         YBBBBBBBBBBY   .PBBBBBBBBBBBB!                                          ?BBBBBBBB~\n         ?BBBBBBBBBBP:   7BBBP5BBBBBBB!                                         7BBBBBBBBP:\n         ~BBBBBBBBBBB!   :PBB?~BBBBBBB?                                       .7BBBBBBBBB?\n         .5BBBBBBBBBBP:   ^GB~ ?BBBBBBY.                                     .JBBBBBBBBB5.\n          !BBBBBBBBBBB5:   ~5: .JBBBBBG^                                    ~5BBBBBBBBBG~\n          .JBBBBBBBBBBB5:   :.  .?GBBBBJ                                  :JGBBBBBBBBBG!\n           :5BBBBBBBBBBBP!.       ~5BBBG^                               :?GBBBBBBBBBBG!\n            :5BBBBBBBBBBBBY~.      .7PBB5.                           .~JGBBBBBBBBBBBP~\n             :YBBBBBBBBBBBBBY!:      .!5GJ.                       .^?PBBBBBBBBBBBBBY^\n              .7GBBBBBBBBBBBBBPJ!:.    .:!:                   .^!JPBBBBBBBBBBBBBBG7.\n                ^YBBBBBBBBBBBBBBBG5J7~^:..             ..:~!?YPBBBBBBBBBBBBBBBBGJ:\n                 .~YBBBBBBBBBBBBBBBBBBGGP5YJJ??????JJY5PGGBBBBBBBBBBBBBBBBBBBGJ^\n                   .~YGBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBP?:\n                      :75GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBPJ~.                        ` + chalk.red(`Version ${this.config.version}`) +`\n                        .^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBG5?~.                           ` + chalk.green(`Last update: ${this.config.lastUpdate}`) + `\n                            :^7J5GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBGPY?~:.\n                                .:^!7JY5PGGBBBBBBBBBBBGGGP5Y?7~:.                                   ` + chalk.bold.yellow("full developed by Ifanoxy#7183") + `\n                                       ..::^^^~~~~~~^^^::..`+ chalk.blue(`\n     _______      ___        _______   __       _______     ______     ______    ___________\n    |   ____|    /   \\      /  _____| |  |     |   ____|   |   _  \\   /  __  \\  |           |\n    |  |__      /  ^  \\    |  |  __   |  |     |  |__      |  |_)  | |  |  |  | |---|  |----|\n    |   __|    /  /_\\  \\   |  | |_ |  |  |     |   __|     |   _  <  |  |  |  |     |  |\n    |  |____  /  _____  \\  |  |__| |  |  |----.|  |____    |  |_)  | |  '--'  |     |  |\n    |_______|/__/     \\__\\  \\______|  |_______||_______|   |______/   \\______/      |__|`))

        this.Collection = Collection;
        this._fs = require("fs");
        this.database = new EagleDatabaseMysql(this);
        this.func = new Functions(this);
        this.database.auth().then(() => {
            this.log("Database connection...")
            this.managers = new EagleManagers(this);
        });

        this.on("ready", () => {
            this.log(`Bot is ready ! Connected on ${this.user.tag}\n`);
            this.user.setPresence({
                status: this.config.discord.presence.status,
                activities: [{
                    name: this.config.discord.presence.name,
                    type: this.config.discord.presence.type,
                }]
            });
        });
    }

    async log(message: string, couleur: any = chalk.blueBright) {
        try {
            let d = new Date();
            (await this.channels.fetch(this.config.forumId) as ForumChannel).threads.cache.find(x => x.name == "Console").send({
                content: `[${("00" + (d.getMonth() + 1)).slice(-2)}/${("00" + d.getDate()).slice(-2)}/${d.getFullYear()} ${("00" + d.getHours()).slice(-2)}:${("00" + d.getMinutes()).slice(-2)}:${("00" + d.getSeconds()).slice(-2)}] \`${message}\``
            })
        } catch {}
        console.log(chalk.bold.greenBright("[Eagle BOT]") + couleur(message));
    }

    startHandler() {
        this.handlers = new EagleHandler(this);
        setTimeout(() => {
            this.login(this.config.discord.token)
                .then(async () => {
                    this.log(`Adding ${this.handlers.slashCommandsHandler.SlashCommandsList.size} slash commands`, chalk.yellow);
                    this.application.commands.set(this.handlers.slashCommandsHandler.SlashCommandsList.map(s => s.data.toJSON()));
                })
        }, 2000)

    }

    async error(err) {
        if (this.isReady()) {
            try {
                (await this.channels.fetch(this.config.forumId) as ForumChannel).threads.cache.find(x => x.name == "Console").send({
                    content: "<@&1069191489105702945> :fire: :fire: :fire:",
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTimestamp()
                            .setTitle("Une erreur c'est produite !")
                            .setDescription(`\`\`\`${err.stack ? err.stack : err}\`\`\``)
                    ]
                })
            } catch {
            }
        }
        console.log(chalk.bold.greenBright("\n[Eagle BOT]") + chalk.red.bold(" an error has occurred :\n" + err))
    }

    isWhitelist(userId: string) {
        if (this.isOwner(userId))return true;
        if (this.managers.whitelistManager.getIfExist(userId))return true;
        else return false;
    }

    isOwner(userId: string) {
        if (userId == this.config.ownerId)return true;
        if (this.managers.ownerManager.getIfExist(userId))return true;
        else return false;
    }

    isSnowflake(str: string) {
        let nbr = Number(str);
        if (isNaN(nbr))return false;
        let bin = nbr.toString(2);
        if (38 > bin.length || bin.length > 64)return false;
        return true
    }

    isBlacklist(userId: string) {
        if (this.managers.blacklistManager.getIfExist(userId))return true;
        else return false;
    }

    hasNotPermissions(interaction: ChatInputCommandInteraction) {
        const guildData = this.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {guildId: interaction.guildId}); guildData.save();
        const commandPermission: string | number = guildData.values.permissions[interaction.commandName];
        if (typeof commandPermission == "string") {
            if (commandPermission == "whitelist") {
                if (this.isWhitelist(interaction.user.id))return false;
                else return "whitelist";
            }
            if (commandPermission == "owner") {
                if (this.isOwner(interaction.user.id))return false;
                else return "owner";
            }
        } else {
            try {
                if (this.isOwner(interaction.user.id)) return false;
                if (!BigInt(commandPermission) || interaction.memberPermissions.has(BigInt(commandPermission))) return false;
                else return new PermissionsBitField(BigInt(commandPermission)).toArray();
            }catch {
                this.error(`La commande ${interaction.commandName} n'a pas de permision !`);
                return "Permission Error"
            }
        }
    }
}