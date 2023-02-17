import { EagleHandler } from "./EagleHandler";
import chalk from 'chalk';
import * as path from "path";

export class EventsHandler{
    EagleHandler: EagleHandler;
    constructor(EagleHandler: EagleHandler) {
        this.EagleHandler = EagleHandler;
        this.EagleHandler.getFiles(path.resolve(__dirname, "..", "..", "Events"), this)
    }

    registerFile(file) {
        const event = require(file).default;
        this.EagleHandler.EagleClient.on(
            event.name,
            (...args) => {
                try {
                    event.execute(this.EagleHandler.EagleClient, ...args);
                } catch (e) {
                    console.log(e);
                }
            }
        );
        this.EagleHandler.EagleClient.log(`Events - Reading ${event.name} event`, chalk.blue)
        delete require.cache[require.resolve(file)];
    }
}