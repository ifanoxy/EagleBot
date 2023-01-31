const chalk = require("chalk");
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "checkMute",
    repeat: true,
    execute(client) {
        const mutesData = client.managers.mutesManager.map(m => m.values)
        console.log(chalk.green.bold("[Eagle BOT]") + chalk.magenta("Checking mutes peoples..."));

        for (const mute of mutesData) {
            if(mute.expiredAt == null) continue;
            const TimeRemaining = Math.round(new Date(mute.expiredAt).getTime()/1000) - Math.round(Date.now()/1000)
            if (TimeRemaining <= 10 * 60 * 1000) {
                setTimeout(() => {
                    const guildData = client.managers.guildsManager.getIfExist(mute.guildId)
                    if (!guildData)return;
                    client.guilds.cache.get(mute.guildId).members.cache.get(mute.memberId).roles.remove(guildData.mute)
                    .then(() => {
                        client.users.cache.get(mute.memberId).send({
                            embeds: [
                                new EmbedBuilder().setColor("Yellow")
                                .setTimestamp().setDescription("Votre mute temporaire est terminé sur le serveur **"+client.guilds.cache.get(mute.guildId).name+"** !")
                            ]
                        })
                    }).catch(() => {})
                    let database = client.managers.mutesManager.getIfExist(`${mute.guildId}-${mute.memberId}`);
                    try {
                        database.delete()
                    } catch (err) {
                        client.err(err)
                    }
                }, TimeRemaining * 1000)
            }
        }
    }
}