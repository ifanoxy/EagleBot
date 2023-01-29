const { PermissionsBitField, Guild, ChannelType } = require('discord.js');

class Moderation {
    constructor(EagleClient) {
        this.EagleClient = EagleClient
    }

    async muteUser({userId, guildId, executor, time, raison}) {
        const member = this.EagleClient.guilds.cache.get(guildId).members.cache.get(userId);
        const role = await this.#checkMuteRole(guildId);
        member.roles.add(role).then(() => {
            this.EagleClient.managers.mutesManager.getAndCreateIfNotExists(guildId, {
                guildId: guildId,
                memberId: member.id,
                createdAt: new Date().getTime(),
                expiredAt: new Date().getTime() + time || null,
                reason: raison || "pas de raison",
                authorId: executor || "par le bot",
            }).save()
        }).catch(() => {});
    }

    #checkMuteRole(guildId) {
        let guildData = this.EagleClient.managers.guildsManager.getAndCreateIfNotExists(guildId, {
            guildId: guildId,
        })
        if (guildData.mute) {
            if (this.EagleClient.guilds.cache.get(guildId).roles.cache.has(guildData.mute))return guildData.mute;
        }
        return this.EagleClient.guilds.cache.get(guildId).roles.create({
            name: "Mute",
            color: "#2e2d2d",
            position: 1000,
        }).then(role => {
            this.EagleClient.guilds.cache.get(guildId).channels.cache.map(g => {
                g.permissionOverwrites.create(role.id,{
                    SendMessages: false,
                    AddReactions: false,
                    Speak: false,
                    Stream: false,
                })
            });
            guildData.mute = role.id;
            guildData.save()
            return role.id
        })
    }

    checkWhitelist(userId) {
        const whitelistData = this.EagleClient.managers.whitelistsManager.getIfExist(userId);
        if (userId == this.EagleClient.config.ownerId)return 1;
        if (!whitelistData)return 0;
        return 1;
    }

    checkBlacklist(userId) {
        const BlacklistData = this.EagleClient.managers.blacklistsManager.getIfExist(userId);
        if (!BlacklistData)return 0;
        return 1;
    }

    checkOwner(userId) {
        const ownerData = this.EagleClient.managers.ownerManager.getIfExist(userId);
        if (userId == this.EagleClient.config.ownerId)return 1;
        if (!ownerData)return 0;
        return 1;
    }
}

module.exports = { Moderation }