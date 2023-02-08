class AntiCrash {
    constructor(EagleClient) {
        this.client = EagleClient;
        process.on("uncaughtException" , (error, origin) => {
            this.client.error(`uncaughtException: \n`+origin+error)
        })
        process.on("unhandledRejection" , (error, origin) => {
            this.client.error(`unhandledRejection: \n`+origin+error)
        })
        this.client.on("error", (error) => {
            this.client.error(`DiscordJS Error: \n`+error.stack)
        })
    }
}

module.exports = { AntiCrash }