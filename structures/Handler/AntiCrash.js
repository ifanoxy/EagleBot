const chalk = require("chalk");

class AntiCrash {
    constructor(EagleClient) {
        this.client = EagleClient;
        setTimeout(() => {
            process.on("uncaughtException" , (error, origin) => {
                console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.red.bold(`uncaughtException: \n`+origin+error.stack));
            })
            process.on("unhandledRejection" , (reason, promise) => {
                console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.red.bold(`unhandledRejection: \n`+ reason + promise.then(a => a)));
            })
            this.client.on("error", (error) => {
                console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.red.bold(`DiscordJS Error: \n`+error.stack));
            })
            this.client.antiraidClient.on("error", (error) => {
                console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.red.bold(`DiscordEris Error: \n`+error.stack));
            })
        }, 5 * 1000)
    }
}

module.exports = { AntiCrash }