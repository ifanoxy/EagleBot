const { EmbedBuilder, GuildEmoji } = require("discord.js");
const { EagleClient } = require("../../structures/Client");
const path = require("path");

module.exports = {
    name: "emojiUpdate",
    /**
     * 
     * @param {EagleClient} client 
     * @param {GuildEmoji} oldParametre 
     * @param {GuildEmoji} newParametre 
     */
    execute(client, oldParametre, newParametre) {
        if (!oldParametre.guild) return;
        const guildData = client.managers.guildsManager.getIfExist(newParametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.emojiUpdate) return;
        const channel = client.channels.cache.get(guildData.logs.channel.emojiUpdate);
        if (channel == null || channel == undefined) return;
        let changement = {};
        if (oldParametre.name != newParametre.name) changement.name = {
            old: oldParametre.name,
            new: newParametre.name,
        };
        if(!Object.entries(changement))return

        let logEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`).setTimestamp().setDescription(`Channel ID : ${newParametre.id} (<#${newParametre.id}>)`)
        if (changement.name) logEmbed.addFields(
            {
                name: "Changement de nom",
                value: `Ancien: ${changement.name.old}\nNouveau: ${changement.name.new}`
            }
        );
        channel.send({
            embeds: [logEmbed]
        }); 
    }
}