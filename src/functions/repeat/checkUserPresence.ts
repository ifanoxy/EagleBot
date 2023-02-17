import chalk from "chalk";
import { EmbedBuilder } from "discord.js";
import { EagleClient } from "../../structures/Client";

module.exports = {
    name: "presenceRole",
    execute(client: EagleClient) {
        const guildsData = client.managers.guildsManager.map(m => m.values).filter(p => p.presenceRole.roleId)
        console.log(chalk.green.bold("[Eagle BOT - Fonctions]") + chalk.magenta("Checking Presence Role..."));

        for (let guildData of guildsData) {
            const guild = client.guilds.cache.get(guildData.guildId);
            guild.members.fetch({
                withPresences: true
            }).then(members => {
                members.map(member => {
                    const activity = member.presence?.activities.filter(x => x.name == "Custom Status").map(x => x.state)[0];
                    if(!activity)return;
                    if (guildData.presenceRole.type == "includes") {
                        if (activity.toLowerCase().includes(guildData.presenceRole.presence.toLowerCase())) {
                            member.roles.add(guildData.presenceRole.roleId).catch(client.error)
                        } else {
                            if (member.roles.cache.get(guildData.presenceRole.roleId))
                                member.roles.remove(guildData.presenceRole.roleId)
                        }
                    } else {
                        if (activity.toLowerCase() == guildData.presenceRole.presence.toLowerCase()) {
                            member.roles.add(guildData.presenceRole.roleId).catch(client.error)
                        } else {
                            if (member.roles.cache.get(guildData.presenceRole.roleId))
                                member.roles.remove(guildData.presenceRole.roleId)
                        }
                    }
                })
            })
        }
    }
}