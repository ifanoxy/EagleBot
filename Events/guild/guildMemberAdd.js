const { AuditLogEvent, GuildMember, EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {EagleClient} client
     * @param {GuildMember} Parametre
     */
    async execute(client, Parametre) {
        let guildData = client.managers.guildsManager.getIfExist(Parametre.guild.id)
        const blacklistsData = client.managers.blacklistsManager.getIfExist(Parametre.user.id);
        if (blacklistsData) {
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
        if (guildData?.autoroles?.length != 0) {
            Parametre.roles.add(guildData.autoroles, "Auto Role").catch(() => {})
        }
        if (guildData.join?.channel) {
            client.fonctions.sendJoinMessage(Parametre.guild.id, Parametre)
        }
    }
};