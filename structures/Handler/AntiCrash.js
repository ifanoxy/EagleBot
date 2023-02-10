class AntiCrash {
    constructor(EagleClient) {
        this.client = EagleClient;
        process.on("uncaughtException" , (error, origin) => {
            console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.red.bold(`uncaughtException: \n`+origin+error));
        })
        process.on("unhandledRejection" , (error, origin) => {
            console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.red.bold(`unhandledRejection: \n`+origin+error));
        })
        this.client.on("error", (error) => {
            console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.red.bold(`DiscordJS Error: \n`+error.stack));
        })
        this.client.antiraidClient.on("error", (error) => {
            console.log(chalk.bold.greenBright("[Eagle BOT]") + chalk.red.bold(`DiscordEris Error: \n`+error.stack));
        })
    }
}

module.exports = { AntiCrash }