import {EagleClient} from "../../structures/Client";
import {EmbedBuilder, Guild} from "discord.js";

export default {
    name: "guildUpdate",
    execute(client: EagleClient, oldGuild: Guild, newGuild: Guild) {
        const channel = client.func.log.isActive(newGuild.id, "GuildUpdate");
        if (!channel)return;
        let changement: any = {};
        if (oldGuild.name != newGuild.name) changement.name = {
            old: oldGuild.name,
            new: newGuild.name,
        };
        if (oldGuild.afkChannelId != newGuild.afkChannelId) changement.afkChannel = {
            old: oldGuild.afkChannelId,
            new: newGuild.afkChannelId,
        };
        if (oldGuild.systemChannelId != newGuild.systemChannelId) changement.systemChannel = {
            old: oldGuild.systemChannelId,
            new: newGuild.systemChannelId,
        };
        if (oldGuild.defaultMessageNotifications != newGuild.defaultMessageNotifications) changement.defaultMessageNotifications = {
            old: oldGuild.defaultMessageNotifications,
            new: newGuild.defaultMessageNotifications,
        };
        if (oldGuild.bannerURL != newGuild.bannerURL) changement.bannerURL = {
            old: oldGuild.bannerURL,
            new: newGuild.bannerURL,
        };
        if (oldGuild.ownerId != newGuild.ownerId) changement.ownerId = {
            old: oldGuild.ownerId,
            new: newGuild.ownerId,
        };
        if (oldGuild.vanityURLCode != newGuild.vanityURLCode) changement.vanityURLCode = {
            old: oldGuild.vanityURLCode,
            new: newGuild.vanityURLCode,
        };
        if(!Object.entries(changement))return

        let logEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`Logs | ${this.name}`).setTimestamp()
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