import chalk from 'chalk';
import * as path from 'path';
import { EagleHandler } from "./EagleHandler";

export class SlashCommandsHandler {
    EagleHandler: EagleHandler;
    SlashCommandsList: any;
    constructor(EagleHandler: EagleHandler) {
        this.EagleHandler = EagleHandler;
        this.SlashCommandsList = new EagleHandler.EagleClient.Collection();
        this.EagleHandler.getFiles(
            path.resolve(__dirname, "..","..","Interactions","SlashCommands"),
            this
        );
    }

    registerFile(file) {
        const pull = require(file);
        if (pull.data.name) {
            this.SlashCommandsList.set(pull.data.name.toLowerCase(), pull);
            delete require.cache[require.resolve(file)]
        }
        this.EagleHandler.EagleClient.log(`Slash Commands - Reading ${pull.data.name} command`, chalk.blue)
    }
}

module.exports = { SlashCommandsHandler }