const { EmbedBuilder, Guild } = require("discord.js");
const { EagleClient } = require("../../structures/Client");
const path = require("path");

module.exports = {
    name: "guildUpdate",
    /**
     * 
     * @param {EagleClient} client 
     * @param {Guild} oldParametre 
     * @param {Guild} newParametre 
     */
    execute(client, oldParametre, newParametre) {
        const guildData = client.managers.guildsManager.getIfExist(newParametre.id);
        if (!guildData) return;
        if (!guildData.logs.enable.GuildUpdate) return;
        const channel = client.channels.cache.get(guildData.logs.channel.GuildUpdate);
        if (channel == null || channel == undefined) return;
        let changement = {};
        if (oldParametre.name != newParametre.name) changement.name = {
            old: oldParametre.name,
            new: newParametre.name,
        };
        if (oldParametre.afkChannelId != newParametre.afkChannelId) changement.afkChannel = {
            old: oldParametre.afkChannelId,
            new: newParametre.afkChannelId,
        };
        if (oldParametre.systemChannelId != newParametre.systemChannelId) changement.systemChannel = {
            old: oldParametre.systemChannelId,
            new: newParametre.systemChannelId,
        };
        if (oldParametre.defaultMessageNotifications != newParametre.defaultMessageNotifications) changement.defaultMessageNotifications = {
            old: oldParametre.defaultMessageNotifications,
            new: newParametre.defaultMessageNotifications,
        };
        if (oldParametre.bannerURL != newParametre.bannerURL) changement.bannerURL = {
            old: oldParametre.bannerURL,
            new: newParametre.bannerURL,
        };
        if (oldParametre.ownerId != newParametre.ownerId) changement.ownerId = {
            old: oldParametre.ownerId,
            new: newParametre.ownerId,
        };
        if (oldParametre.vanityURLCode != newParametre.vanityURLCode) changement.vanityURLCode = {
            old: oldParametre.vanityURLCode,
            new: newParametre.vanityURLCode,
        };
        if(!Object.entries(changement))return

        let logEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`Logs | ${path.basename(__filename).replace(".js", "")}`).setTimestamp()
        if (changement.name) logEmbed.addFields(
            {
                name: "Changement de nom",
                value: `Ancien: ${changement.name.old}\nNouveau: ${changement.name.new}`
            }
        );
        if (changement.afkChannel) logEmbed.addFields(
            {
                name: "Changement de channel d'afk",
                value: `Ancien: ${changement.afkChannel.old}\nNouveau: ${changement.afkChannel.new}`
            }
        );
        if (changement.systemChannel) logEmbed.addFields(
            {
                name: "Changement de channel des messages systèmes",
                value: `Ancien: ${changement.systemChannel.old}\nNouveau: ${changement.systemChannel.new}`
            }
        );
        if (changement.defaultMessageNotifications) logEmbed.addFields(
            {
                name: "Changement des notifications par défault",
                value: `Ancien: ${changement.defaultMessageNotifications.old ? "Seulement Mention" : "Tout les messages"}\nNouveau: ${changement.defaultMessageNotifications.new ? "Seulement Mention" : "Tout les messages"}`
            }
        );
        if (changement.bannerURL) logEmbed.addFields(
            {
                name: "Changement de la bannière",
                value: `Ancienne: ${changement.bannerURL.old}\nNouvelle: ${changement.bannerURL.new}`
            }
        );
        if (changement.ownerId) logEmbed.addFields(
            {
                name: "Changement de propriétaire",
                value: `Ancienne: ${changement.ownerId.old}\nNouvelle: ${changement.ownerId.new}`
            }
        );
        if (changement.vanityURLCode) logEmbed.addFields(
            {
                name: "Changement du lien d'invitation",
                value: `Ancien: ${changement.vanityURLCode.old}\nNouveau: ${changement.vanityURLCode.new}`
            }
        );
        channel.send({
            embeds: [logEmbed]
        }); 
    }
}