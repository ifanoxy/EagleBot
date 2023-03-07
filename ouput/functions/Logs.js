"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logs {
    constructor(client) {
        this.client = client;
    }
    isActive(guildId, logName) {
        const guildData = this.client.managers.guildsManager.getIfExist(guildId);
        if (!guildData)
            return null;
        if (!guildData.logs)
            return null;
        if (!guildData.logs[logName])
            return null;
        const channel = this.client.channels.cache.get(guildData.logs[logName]);
        if (!channel) {
            guildData.logs[logName] = null;
            return null;
        }
        if (!channel.isTextBased() || channel.isVoiceBased())
            return null;
        return channel;
    }
}
exports.default = Logs;
