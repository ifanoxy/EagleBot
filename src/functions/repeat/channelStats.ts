const chalk = require("chalk");
const { ChannelType } = require("discord.js")

export default {
    name: "channelstats",
    repeat: true,
    async execute(client) {
        console.log(chalk.green.bold("[Eagle BOT - Fonctions]") + chalk.magenta("checking servers stats channels..."));
        const statsData = client.managers.statsManager.map(m => m.values)
        for (let guildData of statsData) {
            const guild = client.guilds.cache.get(guildData.guildId);
            if (!guild) continue;
            for (let channelStats of guildData.data) {
                switch (channelStats.type) {
                    case "Channels_All" : {
                        const channel = guild.channels.cache.get(channelStats.channelId);
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `Channels Totaux: ${guild.channels.cache.size}`,
                        })
                    }break;
                    case "Channels_Text" : {
                        const channel = guild.channels.cache.get(channelStats.channelId)
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `Channels Textuels: ${guild.channels.cache.filter(c => c.type == ChannelType.GuildText).size}`,
                        })
                    }break;
                    case "Channels_Voice" : {
                        const channel = guild.channels.cache.get(channelStats.channelId)
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `Channels Vocaux: ${guild.channels.cache.filter(c => c.type == ChannelType.GuildVoice).size}`,
                        })
                    }break;
                    case "Roles_All" : {
                        const channel = guild.channels.cache.get(channelStats.channelId)
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `Roles Totaux: ${guild.roles.cache.size}`,
                        })
                    }break;
                    case "Roles_Members" : {
                        const channel = guild.channels.cache.get(channelStats.channelId)
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `${await guild.roles.cache.get(channelStats.roleId)?.name}: ${guild.roles.cache.get(channelStats.roleId)?.members.size}`,
                        })
                    }break;
                    case "Members_All" : {
                        const channel = guild.channels.cache.get(channelStats.channelId)
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `Utilisateurs: ${guild.members.cache.size}`
                        })
                    }break;
                    case "Members_Humans" : {
                        const channel = guild.channels.cache.get(channelStats.channelId)
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `Membres: ${guild.members.cache.filter(m => !m.user.bot).size}`
                        })
                    }break;
                    case "Members_Bots" : {
                        const channel = guild.channels.cache.get(channelStats.channelId)
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `Bots: ${guild.members.cache.filter(m => m.user.bot).size}`,
                        })
                    }break;
                    case "Voice_All" : {
                        const channel = guild.channels.cache.get(channelStats.channelId)
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `Membres en vocal: ${guild.members.cache.filter(m => m.voice.channel).size}`,
                        })
                    }break;
                    case "Status_Online" : {
                        const channel = guild.channels.cache.get(channelStats.channelId)
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `Membres en ligne: ${await guild.members.fetch().then(data => data.filter(x => x.presence?.status == "online").size)}/${guild.members.cache.size}`,
                        })
                    }break;
                    case "Status_Offline" : {
                        const channel = guild.channels.cache.get(channelStats.channelId)
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `Membres Inactifs: ${await guild.members.fetch().then(data => data.filter(x => x.presence?.status == "offline").size)}/${guild.members.cache.size}`,
                        })
                    }break;
                    case "Status_NotOffline" : {
                        const channel = guild.channels.cache.get(channelStats.channelId)
                        if (!channel){
                            removeDatase(guildData, channelStats)
                            continue
                        }
                        channel.edit({
                            name: `Membres Actifs: ${await guild.members.fetch().then(data => data.filter(x => x.presence?.status != "offline").size)}/${guild.members.cache.size}`,
                        })
                    }break;
                }
            }
        }
        function removeDatase(guildData, channelStats) {
            var database = client.managers.statsManager.getAndCreateIfNotExists(guildData.guildId, {
                guildId: guildData.guildId
            });
            database.data = database.data.filter(a => a.channelId != channelStats.channelId)
            database.save()
        }
    }
}