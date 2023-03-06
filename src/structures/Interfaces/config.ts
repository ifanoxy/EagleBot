export default interface Config {
    discord: {
        token: string,
        presence: {
            name: string,
            type: number,
            status: "idle" | "dnd" | "online",
        }
    },
    database: {
        name: string,
        username: string,
        password: string,
        host: string,
    },
    webhook: {
        token: string,
        id: string,
    },
    ownerId: string,
    version: string,
    lastUpdate: string,
    modmailChannelId: string,
}