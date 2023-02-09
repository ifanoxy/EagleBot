const chalk = require("chalk");
const { EmbedBuilder } = require("discord.js");
const { EagleClient } = require("../../structures/Client");

module.exports = {
    name: "presenceRole",
    repeat: true,
    /**
     * 
     * @param {EagleClient} client 
     */
    execute(client) {
        const presenceData = client.managers.guildsManager.map(m => [m.guildId, m.presenceRole]).filter(g => g[1].roleId)
        console.log(chalk.green.bold("[Eagle BOT - Fonctions]") + chalk.magenta("Checking Presence Role..."));

        for (let Data of presenceData) {
            const guild = client.guilds.cache.get(Data[0]);
            guild.members.fetch({
                withPresences: true
            }).then(members => {
                members.map(member => {
                    const activity = member.presence?.activities.filter(x => x.name == "Custom Status").map(x => x.state)[0];
                    if(!activity)return;
                    if (Data[1].type == "includes") {
                        if (activity.toLowerCase().includes(Data[1].presence.toLowerCase())) {
                            member.roles.add(Data[1].roleId).catch(client.error)
                        } else {
                            if (member.roles.cache.get(Data[1].roleId))
                            member.roles.remove(Data[1].roleId)
                        }
                    } else {
                        if (activity.toLowerCase() == Data.presence.toLowerCase()) {
                            member.roles.add(Data[1].roleId).catch(client.error)
                        } else {
                            if (member.roles.cache.get(Data[1].roleId))
                            member.roles.remove(Data[1].roleId)
                        }
                    }
                })
            })
        }
    }
}