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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EagleClient = void 0;
const discord_js_1 = require("discord.js");
const EagleHandler_1 = require("./Handler/EagleHandler");
const DataBase_1 = require("./DataBase");
const Managers_1 = __importDefault(require("./Managers"));
const chalk_1 = __importDefault(require("chalk"));
const main_1 = __importDefault(require("../functions/main"));
String.prototype.replaceArray = function (find, replace) {
    var replaceString = this;
    var regex;
    for (var i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g");
        replaceString = replaceString.replace(regex, replace[i]);
    }
    return replaceString;
};
class EagleClient extends discord_js_1.Client {
    constructor() {
        super({
            closeTimeout: 7 * 1000,
            intents: 3276799,
            partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.GuildMember, discord_js_1.Partials.GuildScheduledEvent, discord_js_1.Partials.Message, discord_js_1.Partials.Reaction, discord_js_1.Partials.ThreadMember, discord_js_1.Partials.User],
        });
        process.on("uncaughtException", this.log);
        process.on("unhandledRejection", this.log);
        process.on("uncaughtExceptionMonitor", this.log);
        this.config = require("../config.json");
        console.log(`\n                               ::\n                               ?PJ~:.\n                               ~BBBG5?~:.\n                                7GBBBBBGPY?!^..      .........\n                             ?!. ^YBBBBBBBBBBP5J!^:.     ..:^~~~~:.\n                            .PB5!:.^?PBBBBBBBBBBBBG5J!^.       .^!??7^.\n                             7BBBGY?!!?YGBBBBBBBBBBBBBBPY?~:       :!JYJ!:\n                             .7GBBBBBBBBBBBBBBBBBBBBBBBBBBBGY7^.!^.   :75PJ~.\n                               ^JGBBBBBBBBBBBBBBBBBBBBBBBBBBBBB5GBY~.   .!5BP7:\n                            :^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBY:    .!PBP?:\n                        .^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBJ7J5GBBBBBBP^     :JBBP7.\n                     .^75GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBY~.:~?5GBBB5.     .7GBB5^\n                   .!YGBBBBBBBBBBBBBBGGGBBBBBBBBBBBBBBBBBBBBB5?~^:^7YPP:       ~GBBG7.\n                 .!5BBBBBBBBBBBBG5J?J5GBBBBBBBBBBBBBBBBBBBBBBBBBGGPYJ7~:        ~GBBBJ.\n                ~5BBBBBBBBBBBGJ!^7YGBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBPJ!:      7BBBBY.\n              :JBBBBBBBBBBBP7::7PBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBP?^    .YBBBBJ.\n             ^5BBBBBBBBBBG7..!PBBBBBBBBBBBBBBBBBBBBGGP555555PPGGBBBBBBBBBBBBG7.   ~BBBBB7\n            ~PBBBBBBBBBBY: .JBBBBBBBBBBBBBBBBBGY?!^:..... ....::^~7?YPGBBBBBBB?   .PBBBBG^\n           ^GBBBBBBBBBBJ. .YBBBBBBBBBBBBBBBGJ~:                      .:!?5BBBBP.   JBBBBBY\n          :5BBBBBBBBBBJ. .JBBBBBBBBBBBBBBGJ:                             .^JGBY    ?BBBBBG^\n          ?BBBBBBBBBB5.  ~BBBBBBBBBBBBBBP~                                  ~J:    ?BBBBBB7\n         :GBBBBBBBBBB~  .YBBBBBBBBBBBBBP^                                          YBBBBBBJ\n         !BBBBBBBBBBP.  :GBBBBBBBBBBBBB!                                          .PBBBBBBY\n         JBBBBBBBBBBY   ^BBBBBBBBBBBBB5.                                          !BBBBBBBY\n         YBBBBBBBBBBJ   :GBBBBBBBBBBBB?                                          .5BBBBBBB?\n         YBBBBBBBBBBY   .PBBBBBBBBBBBB!                                          ?BBBBBBBB~\n         ?BBBBBBBBBBP:   7BBBP5BBBBBBB!                                         7BBBBBBBBP:\n         ~BBBBBBBBBBB!   :PBB?~BBBBBBB?                                       .7BBBBBBBBB?\n         .5BBBBBBBBBBP:   ^GB~ ?BBBBBBY.                                     .JBBBBBBBBB5.\n          !BBBBBBBBBBB5:   ~5: .JBBBBBG^                                    ~5BBBBBBBBBG~\n          .JBBBBBBBBBBB5:   :.  .?GBBBBJ                                  :JGBBBBBBBBBG!\n           :5BBBBBBBBBBBP!.       ~5BBBG^                               :?GBBBBBBBBBBG!\n            :5BBBBBBBBBBBBY~.      .7PBB5.                           .~JGBBBBBBBBBBBP~\n             :YBBBBBBBBBBBBBY!:      .!5GJ.                       .^?PBBBBBBBBBBBBBY^\n              .7GBBBBBBBBBBBBBPJ!:.    .:!:                   .^!JPBBBBBBBBBBBBBBG7.\n                ^YBBBBBBBBBBBBBBBG5J7~^:..             ..:~!?YPBBBBBBBBBBBBBBBBGJ:\n                 .~YBBBBBBBBBBBBBBBBBBGGP5YJJ??????JJY5PGGBBBBBBBBBBBBBBBBBBBGJ^\n                   .~YGBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBP?:\n                      :75GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBPJ~.                        ` + chalk_1.default.red(`Version ${this.config.version}`) + `\n                        .^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBG5?~.                           ` + chalk_1.default.green(`Last update: ${this.config.lastUpdate}`) + `\n                            :^7J5GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBGPY?~:.\n                                .:^!7JY5PGGBBBBBBBBBBBGGGP5Y?7~:.                                   ` + chalk_1.default.bold.yellow("full developed by Ifanoxy#7183") + `\n                                       ..::^^^~~~~~~^^^::..` + chalk_1.default.blue(`\n     _______      ___        _______   __       _______     ______     ______    ___________\n    |   ____|    /   \\      /  _____| |  |     |   ____|   |   _  \\   /  __  \\  |           |\n    |  |__      /  ^  \\    |  |  __   |  |     |  |__      |  |_)  | |  |  |  | |---|  |----|\n    |   __|    /  /_\\  \\   |  | |_ |  |  |     |   __|     |   _  <  |  |  |  |     |  |\n    |  |____  /  _____  \\  |  |__| |  |  |----.|  |____    |  |_)  | |  '--'  |     |  |\n    |_______|/__/     \\__\\  \\______|  |_______||_______|   |______/   \\______/      |__|`));
        this.Collection = discord_js_1.Collection;
        this._fs = require("fs");
        this.database = new DataBase_1.EagleDatabaseMysql(this);
        this.func = new main_1.default(this);
        this.database.auth().then(() => {
            this.log("Database connection...");
            this.managers = new Managers_1.default(this);
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
    log(message, couleur = chalk_1.default.blueBright) {
        console.log(chalk_1.default.bold.greenBright("[Eagle BOT]") + couleur(message));
    }
    startHandler() {
        this.handlers = new EagleHandler_1.EagleHandler(this);
        this.login(this.config.discord.token)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            this.log(`Adding ${this.handlers.slashCommandsHandler.SlashCommandsList.size} slash commands`, chalk_1.default.yellow);
            this.application.commands.set(this.handlers.slashCommandsHandler.SlashCommandsList.map(s => s.data.toJSON()));
        }));
    }
    error(err) {
        console.log(chalk_1.default.bold.greenBright("\n[Eagle BOT]") + chalk_1.default.red.bold(" an error has occurred :\n" + err));
    }
    isWhitelist(userId) {
        if (this.isOwner(userId))
            return true;
        if (this.managers.whitelistManager.getIfExist(userId))
            return true;
        else
            return false;
    }
    isOwner(userId) {
        if (userId == this.config.ownerId)
            return true;
        if (this.managers.ownerManager.getIfExist(userId))
            return true;
        else
            return false;
    }
    isSnowflake(str) {
        let nbr = Number(str);
        if (isNaN(nbr))
            return false;
        let bin = nbr.toString(2);
        if (38 > bin.length || bin.length > 64)
            return false;
        return true;
    }
    isBlacklist(userId) {
        if (this.managers.blacklistManager.getIfExist(userId))
            return true;
        else
            return false;
    }
    hasNotPermissions(interaction) {
        const guildData = this.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, { guildId: interaction.guildId });
        guildData.save();
        const commandPermission = guildData.values.permissions[interaction.commandName];
        if (typeof commandPermission == "string") {
            if (commandPermission == "whitelist") {
                if (this.isWhitelist(interaction.user.id))
                    return false;
                else
                    return "whitelist";
            }
            if (commandPermission == "owner") {
                if (this.isOwner(interaction.user.id))
                    return false;
                else
                    return "owner";
            }
        }
        else {
            try {
                if (this.isOwner(interaction.user.id))
                    return false;
                if (!BigInt(commandPermission) || interaction.memberPermissions.has(BigInt(commandPermission)))
                    return false;
                else
                    return new discord_js_1.PermissionsBitField(BigInt(commandPermission)).toArray();
            }
            catch (_a) {
                this.error(`La commande ${interaction.commandName} n'a pas de permision !`);
                return "Permission Error";
            }
        }
    }
}
exports.EagleClient = EagleClient;
