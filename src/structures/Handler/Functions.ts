const chalk = require('chalk');
const path = require('path');
import { Collection } from "discord.js";
import {EagleHandler} from "./EagleHandler";

export default class FunctionHandler {
    EagleHandler: EagleHandler;
    FonctionsList: Collection<string,{name: string, execute: () => {}}>;

    constructor(EagleHandler: EagleHandler) {
        this.EagleHandler = EagleHandler;
        this.FonctionsList = new Collection();
        this.EagleHandler.getFiles(
            path.resolve(__dirname, "..","..","functions","repeat"),
            this
        );
        setTimeout(() => {
            this.startFonction(this.FonctionsList, this.EagleHandler.EagleClient)
        }, 2500)
    }

    registerFile(file) {
        const pull = require(file).default;
        if (pull.name) {
            this.FonctionsList.set(pull.name.toLowerCase(), pull);
            delete require.cache[require.resolve(file)]
        }
        console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.blue(`Fonctions - Reading ${pull.name} fonction`));
    }

    startFonction(list, client) {
        setInterval(function myFunction() {
            list.map(file => {
                try {
                    file.execute(client)
                } catch (err) {
                    client.error(err)
                }
            })
            return myFunction;
        }(), 15 * 60 * 1000)

    }
}