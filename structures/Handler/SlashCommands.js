const chalk = require('chalk');
const path = require('path');

class SlashCommandsHandler {
    constructor(EagleHandler) {
        this.EagleHandler = EagleHandler;
        this.SlashCommandsList = new EagleHandler.EagleClient.Collection();
        this.EagleHandler.getFiles(
            path.resolve(__dirname, "..","..","SlashCommands"),
            this
        );
    }

    registerFile(file) {
        const pull = require(file);
        if (pull.data.name) {
            this.SlashCommandsList.set(pull.data.name.toLowerCase(), pull);
            delete require.cache[require.resolve(file)]
        }
        console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.blue(`Slash Commands - Reading ${pull.data.name} command`));
    }
}

module.exports = { SlashCommandsHandler }