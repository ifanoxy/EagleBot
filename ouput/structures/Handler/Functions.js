"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require('chalk');
const path = require('path');
const discord_js_1 = require("discord.js");
class FunctionHandler {
    constructor(EagleHandler) {
        this.EagleHandler = EagleHandler;
        this.FonctionsList = new discord_js_1.Collection();
        this.EagleHandler.getFiles(path.resolve(__dirname, "..", "..", "functions", "repeat"), this);
        setTimeout(() => {
            this.startFonction(this.FonctionsList, this.EagleHandler.EagleClient);
        }, 2500);
    }
    registerFile(file) {
        const pull = require(file).default;
        if (pull.name) {
            this.FonctionsList.set(pull.name.toLowerCase(), pull);
            delete require.cache[require.resolve(file)];
        }
        console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.blue(`Fonctions - Reading ${pull.name} fonction`));
    }
    startFonction(list, client) {
        list.filter(x => !x.repeat).map(file => {
            try {
                file.execute(client);
            }
            catch (err) {
                client.error(err);
            }
        });
        setInterval(function myFunction() {
            list.filter(x => x.repeat).map(file => {
                try {
                    file.execute(client);
                }
                catch (err) {
                    client.error(err);
                }
            });
            return myFunction;
        }(), 15 * 60 * 1000);
    }
}
exports.default = FunctionHandler;
