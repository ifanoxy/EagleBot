const { Client, Collection } = require("eris");
const config = require("../config");
const chalk = require("chalk");
const { EagleDatabaseSqlite } = require("./DataBase");
const { Manager } = require("./Managers/main");
const { AntiraidHandler } = require("./Handler/AntiraidHandler");

class AntiRaidClient extends Client {
    constructor() {
        super(config.discord.token, {
            autoreconnect: true,
            compress: false,
            intents: ["guilds", "guildBans", "guildWebhooks", "guildMessages"],
        });
        
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
        this.connect()
        this.handler = new AntiraidHandler(this)
    }

    log(msg, color = chalk.blue) {
        console.log(chalk.bold.green("[Eagle BOT - Anti Raid]")+ color(msg))
    }
}

module.exports = { AntiRaidClient }