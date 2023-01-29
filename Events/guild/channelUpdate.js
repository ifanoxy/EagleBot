const { EmbedBuilder, GuildChannel, ChannelType } = require("discord.js");
const { EagleClient } = require("../../structures/Client");
const path = require("path");

module.exports = {
    name: "channelUpdate",
    /**
     * 
     * @param {EagleClient} client 
     * @param {GuildChannel} oldParametre 
     * @param {GuildChannel} newParametre 
     */
    execute(client, oldParametre, newParametre) {
        if (!oldParametre.guild) return;
        const guildData = client.managers.guildsManager.getIfExist(newParametre.guild.id);
        if (!guildData) return;
        if (!guildData.logs.enable.channelUpdate) return;
        const channel = client.channels.cache.get(guildData.logs.channel.channelUpdate);
        if (channel == null || channel == undefined) return;
        let changement = {};
        if (oldParametre.name != newParametre.name) changement.name = {
            old: oldParametre.name,
            new: newParametre.name,
        };
        if (oldParametre?.topic != newParametre?.topic && newParametre != null) changement.topic = {
            old: oldParametre.topic,
            new: newParametre.topic,
        };
        if (oldParametre?.parentId != newParametre?.parentId) changement.parent = {
            old: oldParametre?.parentId,
            new: newParametre?.parentId,
        };
        if(!Object.entries(changement))return

        let logEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`).setTimestamp().setDescription(`Channel ID : ${newParametre.id} (<#${newParametre.id}>)`)
        if (changement.name) logEmbed.addFields(
            {
                name: "Changement de nom",
                value: `Ancien: ${changement.name.old}\nNouveau: ${changement.name.new}`
            }
        );
        if (changement.topic) logEmbed.addFields(
            {
                name: "Changement de topic",
                value: `Ancien: ${changement.topic.old}\nNouveau: ${changement.topic.new}`
            }
        );
        if (changement.parent) logEmbed.addFields(
            {
                name: "Changement de Catégorie",
                value: `Ancienne: ${changement.parent.old}\nNouvelle: ${changement.parent.new}`
            }
        );
        channel.send({
            embeds: [logEmbed]
        }); 
    }
}