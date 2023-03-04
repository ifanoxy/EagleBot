import { EagleClient } from "../../structures/Client";
import chalk from "chalk";
import { EmbedBuilder } from "discord.js";

export default  {
    name: "checkMute",
    repeat: true,
    execute(client: EagleClient) {
        const mutesData = client.managers.muteManager.map(m => m.values)
        console.log(chalk.green.bold("[Eagle BOT - Functions]") + chalk.magenta("Checking mutes peoples..."));

        for (const mute of mutesData) {
            const TimeRemaining = Math.round(new Date(mute.expiredAt).getTime()/1000) - Math.round(Date.now()/1000);
            if (TimeRemaining <= 15 * 60 * 1000) {
                setTimeout(() => {
                    const guildData = client.managers.guildsManager.getIfExist(mute.guildId);
                    if (!guildData)return;
                    client.guilds.cache.get(mute.guildId).members.cache.get(mute.memberId).roles.remove(guildData.muteRoleId)
                        .then(() => {
                            client.users.cache.get(mute.memberId).send({
                                embeds: [
                                    new EmbedBuilder().setColor("Yellow")
                                        .setTimestamp().setDescription("Votre mute temporaire est terminé sur le serveur **"+client.guilds.cache.get(mute.guildId).name+"** !")
                                ]
                            }).catch();
                            client.managers.muteManager.getIfExist(`${mute.memberId}-${mute.guildId}`).delete();
                        }).catch()
                }, TimeRemaining * 1000)
            }
        }
    }
}