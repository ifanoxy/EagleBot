import chalk from 'chalk';
import * as path from 'path';
import { EagleHandler } from "./EagleHandler";
import {Collection, SlashCommandBuilder} from "discord.js";

export class SlashCommandsHandler {
    EagleHandler: EagleHandler;
    SlashCommandsList: Collection<string, {data: SlashCommandBuilder, execute: (...x) => {}, autocomplete?: (...x) => {}}>;
    constructor(EagleHandler: EagleHandler) {
        this.EagleHandler = EagleHandler;
        this.SlashCommandsList = new Collection();
        this.EagleHandler.getFiles(
            path.resolve(__dirname, "..","..","Interactions","SlashCommands"),
            this
        );
    }

    registerFile(file) {
        const pull = require(file).default;
        if (pull.data.name) {
            this.SlashCommandsList.set(pull.data.name.toLowerCase(), pull);
            delete require.cache[require.resolve(file)]
        }
        this.EagleHandler.EagleClient.log(`Slash Commands - Reading ${pull.data.name} command`, chalk.blue)
    }
}

module.exports = { SlashCommandsHandler }