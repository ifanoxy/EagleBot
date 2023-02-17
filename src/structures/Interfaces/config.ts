export default interface Config {
    discord: {
        token: string
    },
    database: {
        name: string,
        username: string,
        password: string,
    },
    webhook: {
        token: string,
        id: string,
    },
    ownerId: string,
    version: string,
    lastUpdate: string,
}