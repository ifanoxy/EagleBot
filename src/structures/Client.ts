import { Client, Partials, Collection, SnowflakeUtil, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Config from "./Interfaces/config"
import { EagleHandler } from "./Handler/EagleHandler";
import { EagleDatabaseSqlite } from "./DataBase";
import EagleManagers from "./Managers";
import chalk from "chalk";
import * as fs from "fs";
import Functions from "../functions/main";

export class EagleClient extends Client {
    Collection: typeof Collection;
    _fs: typeof fs;
    config: Config;
    database: EagleDatabaseSqlite;
    managers: EagleManagers;
    handlers: EagleHandler;
    func: Functions;

    constructor() {
        super({
            closeTimeout: 7 * 1000,
            intents: 3276799,
            partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User],
        })
        this.config = require("../config").default;
        console.log(`\n                               ::\n                               ?PJ~:.\n                               ~BBBG5?~:.\n                                7GBBBBBGPY?!^..      .........\n                             ?!. ^YBBBBBBBBBBP5J!^:.     ..:^~~~~:.\n                            .PB5!:.^?PBBBBBBBBBBBBG5J!^.       .^!??7^.\n                             7BBBGY?!!?YGBBBBBBBBBBBBBBPY?~:       :!JYJ!:\n                             .7GBBBBBBBBBBBBBBBBBBBBBBBBBBBGY7^.!^.   :75PJ~.\n                               ^JGBBBBBBBBBBBBBBBBBBBBBBBBBBBBB5GBY~.   .!5BP7:\n                            :^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBY:    .!PBP?:\n                        .^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBJ7J5GBBBBBBP^     :JBBP7.\n                     .^75GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBY~.:~?5GBBB5.     .7GBB5^\n                   .!YGBBBBBBBBBBBBBBGGGBBBBBBBBBBBBBBBBBBBBB5?~^:^7YPP:       ~GBBG7.\n                 .!5BBBBBBBBBBBBG5J?J5GBBBBBBBBBBBBBBBBBBBBBBBBBGGPYJ7~:        ~GBBBJ.\n                ~5BBBBBBBBBBBGJ!^7YGBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBPJ!:      7BBBBY.\n              :JBBBBBBBBBBBP7::7PBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBP?^    .YBBBBJ.\n             ^5BBBBBBBBBBG7..!PBBBBBBBBBBBBBBBBBBBBGGP555555PPGGBBBBBBBBBBBBG7.   ~BBBBB7\n            ~PBBBBBBBBBBY: .JBBBBBBBBBBBBBBBBBGY?!^:..... ....::^~7?YPGBBBBBBB?   .PBBBBG^\n           ^GBBBBBBBBBBJ. .YBBBBBBBBBBBBBBBGJ~:                      .:!?5BBBBP.   JBBBBBY\n          :5BBBBBBBBBBJ. .JBBBBBBBBBBBBBBGJ:                             .^JGBY    ?BBBBBG^\n          ?BBBBBBBBBB5.  ~BBBBBBBBBBBBBBP~                                  ~J:    ?BBBBBB7\n         :GBBBBBBBBBB~  .YBBBBBBBBBBBBBP^                                          YBBBBBBJ\n         !BBBBBBBBBBP.  :GBBBBBBBBBBBBB!                                          .PBBBBBBY\n         JBBBBBBBBBBY   ^BBBBBBBBBBBBB5.                                          !BBBBBBBY\n         YBBBBBBBBBBJ   :GBBBBBBBBBBBB?                                          .5BBBBBBB?\n         YBBBBBBBBBBY   .PBBBBBBBBBBBB!                                          ?BBBBBBBB~\n         ?BBBBBBBBBBP:   7BBBP5BBBBBBB!                                         7BBBBBBBBP:\n         ~BBBBBBBBBBB!   :PBB?~BBBBBBB?                                       .7BBBBBBBBB?\n         .5BBBBBBBBBBP:   ^GB~ ?BBBBBBY.                                     .JBBBBBBBBB5.\n          !BBBBBBBBBBB5:   ~5: .JBBBBBG^                                    ~5BBBBBBBBBG~\n          .JBBBBBBBBBBB5:   :.  .?GBBBBJ                                  :JGBBBBBBBBBG!\n           :5BBBBBBBBBBBP!.       ~5BBBG^                               :?GBBBBBBBBBBG!\n            :5BBBBBBBBBBBBY~.      .7PBB5.                           .~JGBBBBBBBBBBBP~\n             :YBBBBBBBBBBBBBY!:      .!5GJ.                       .^?PBBBBBBBBBBBBBY^\n              .7GBBBBBBBBBBBBBPJ!:.    .:!:                   .^!JPBBBBBBBBBBBBBBG7.\n                ^YBBBBBBBBBBBBBBBG5J7~^:..             ..:~!?YPBBBBBBBBBBBBBBBBGJ:\n                 .~YBBBBBBBBBBBBBBBBBBGGP5YJJ??????JJY5PGGBBBBBBBBBBBBBBBBBBBGJ^\n                   .~YGBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBP?:\n                      :75GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBPJ~.                        ` + chalk.red(`Version ${this.config.version}`) +`\n                        .^7YPBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBG5?~.                           ` + chalk.green(`Last update: ${this.config.lastUpdate}`) + `\n                            :^7J5GBBBBBBBBBBBBBBBBBBBBBBBBBBBBBGPY?~:.\n                                .:^!7JY5PGGBBBBBBBBBBBGGGP5Y?7~:.                                   ` + chalk.bold.yellow("full developed by Ifanoxy#7183") + `\n                                       ..::^^^~~~~~~^^^::..`+ chalk.blue(`\n     _______      ___        _______   __       _______     ______     ______    ___________\n    |   ____|    /   \\      /  _____| |  |     |   ____|   |   _  \\   /  __  \\  |           |\n    |  |__      /  ^  \\    |  |  __   |  |     |  |__      |  |_)  | |  |  |  | |---|  |----|\n    |   __|    /  /_\\  \\   |  | |_ |  |  |     |   __|     |   _  <  |  |  |  |     |  |\n    |  |____  /  _____  \\  |  |__| |  |  |----.|  |____    |  |_)  | |  '--'  |     |  |\n    |_______|/__/     \\__\\  \\______|  |_______||_______|   |______/   \\______/      |__|`))

        this.Collection = Collection;
        this._fs = require("fs");
        this.database = new EagleDatabaseSqlite();
        this.func = new Functions(this);
        this.database.auth().then(() => {
            this.log("Database connection...")
            this.managers = new EagleManagers(this);
            setTimeout(() => {
                console.log(this.managers.guildsManager)
            }, 5000)
        });
        this.on("ready", () => {
            this.log(`Bot is ready ! Connected on ${this.user.tag}\n`);
            this.user.setPresence({
                status: "online",
                activities: [{
                    name: `Version ${this.config.version}`,
                    type: 3,

                }]
            });
        });
    }

    log(message: string, couleur: any = chalk.blueBright) {
        console.log(chalk.bold.greenBright("[Eagle BOT]") + couleur(message));
    }

    startHandler() {
        this.handlers = new EagleHandler(this);
        this.login(this.config.discord.token)
            .then(() => {
                this.log(`Adding ${this.handlers.slashCommandsHandler.SlashCommandsList.size} slash commands`, chalk.yellow)
                this.application.commands.set(this.handlers.slashCommandsHandler.SlashCommandsList.map(s => s.data.toJSON()))
            })
    }

    error(err) {
        console.log(chalk.bold.greenBright("\n[Eagle BOT]") + chalk.red.bold(" an error has occurred :\n" + err))
    }

    hasNotPermissions(interaction: ChatInputCommandInteraction) {
        const guildData = this.managers.guildsManager.getAndCreateIfNotExists(interaction.guildId, {guildId: interaction.guildId}); guildData.save();
        const commandPermission = BigInt(guildData.values.permissions[interaction.commandName]);
        if (!commandPermission || interaction.memberPermissions.has(commandPermission))return false;
        else return new PermissionsBitField(commandPermission).toArray();
    }
}