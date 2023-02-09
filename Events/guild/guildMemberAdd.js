const { AuditLogEvent, GuildMember, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} Parametre
     */
    async execute(client, Parametre) {
        let guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id)
        const blacklistsData = client.managers.blacklistsManager.getIfExist(Parametre.user.id);
        if (blacklistsData) {
            Parametre.user.send(`Vous êtes blacklist de ce serveur !\n\nraison: ${blacklistsData.reason}`)
            Parametre.ban({
                reason: "Blacklist",
            })
        };
        if (guildData?.greetPing?.status) {
            for (let channelId of guildData.greetPing.channels) {
                setTimeout(() => {
                    Parametre.guild.channels.fetch(channelId)
                    .then(channel => {
                        channel.send(`<@${Parametre.user.id}>`)
                        .then(msg => {
                            setTimeout(() => {
                                msg.delete()
                            }, 1000)
                        })
                    })
                    .catch(() => {
                        guildData.greetPing.channels = guildData.greetPing.channels.filter(m => m != channelId)
                        guildData.save()
                    })
                }, 500)
            }
        }
    }
};