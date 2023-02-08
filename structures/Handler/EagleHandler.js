const chalk = require("chalk");
const { AntiCrash } = require("./AntiCrash");
const { EventsHandler } = require("./Events");
const { FonctionHandler } = require("./FonctionHandler");
const { SlashCommandsHandler } = require("./SlashCommands");

class EagleHandler {
    constructor(EagleClient) {
        this.EagleClient = EagleClient;
        this.slashCommandsHandler = new SlashCommandsHandler(this);
        setTimeout(() => {
            console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.redBright(`All Slash Commands successfully loaded`));
            this.eventHandler = new EventsHandler(this);
            setTimeout(() => {
                console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.redBright(`All Events successfully loaded`));
                this.fonctionHandler = new FonctionHandler(this);
                setTimeout(() => {
                    console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.redBright(`All fonctions successfully loaded`));
                }, 200);
            }, 200);
        }, 200);
        new AntiCrash(this.EagleClient);
    }
  
    getFiles(path, handler) {
        this.EagleClient._fs.readdir(path, (err, files) => {
        if (err) throw err;
            files.map((file) => {
                if (file.endsWith(".disabled")) return;
                if (file.endsWith(".js") && files !== "anticrash")
                    return handler.registerFile(`${path}/${file}`, this.EagleClient);   
                if (!file.includes(".")) this.getFiles(`${path}/${file}`, handler);
            })
        });
    }
}

module.exports = { EagleHandler }