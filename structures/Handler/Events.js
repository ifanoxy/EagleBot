const chalk = require('chalk');
const path = require('path');
class EventsHandler {
    constructor(EagleHandler) {
        this.EagleHandler = EagleHandler;
        this.EagleHandler.getFiles(path.resolve(__dirname, "..", "..", "Events"), this)
    }
    
    registerFile(file) {
        const event = require(file);
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
        console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.blue(`Events - Reading ${event.name} event`));
        delete require.cache[require.resolve(file)];
    }
}

module.exports = { EventsHandler }