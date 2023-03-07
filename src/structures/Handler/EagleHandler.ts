import chalk from "chalk";
import { EagleClient } from "../Client";
import { EventsHandler } from "./Events";
import FunctionHandler from "./Functions";
import { SlashCommandsHandler } from "./SlashCommands";

export class EagleHandler {
    EagleClient: EagleClient;
    slashCommandsHandler: SlashCommandsHandler;
    eventHandler: EventsHandler;
    functionsHandler: FunctionHandler;
    constructor(EagleClient: EagleClient) {
        this.EagleClient = EagleClient;
        this.slashCommandsHandler = new SlashCommandsHandler(this);
        setTimeout(() => {
            this.EagleClient.log(`All Slash Commands successfully loaded`, chalk.redBright);
            this.eventHandler = new EventsHandler(this);
            setTimeout(() => {
                this.EagleClient.log(`All Events successfully loaded`, chalk.redBright);
                this.functionsHandler = new FunctionHandler(this);
                setTimeout(() => {
                    this.EagleClient.log(`All Functions successfully loaded`, chalk.redBright);
                }, 200)
            }, 200);
        }, 200);
    }

    getFiles(path: string, handler: EventsHandler) {
        this.EagleClient._fs.readdir(path, (err, files) => {
            if (err) throw err;
            files.map((file) => {
                if (file.endsWith(".disabled")) return;
                if (file.endsWith(".ts") || file.endsWith(".js"))
                    return handler.registerFile(`${path}/${file}`);
                if (!file.includes(".")) this.getFiles(`${path}/${file}`, handler);
            })
        });
    }
}

module.exports = { EagleHandler }