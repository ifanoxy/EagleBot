import {EagleClient} from "../../structures/Client";
import {ChannelType, EmbedBuilder, GuildChannel} from "discord.js";

export default {
    name: "channelUpdate",
    execute(client: EagleClient, oldChannel: GuildChannel | null, newChannel: GuildChannel) {
        const channel = client.func.log.isActive(newChannel.guildId, "ChannelUpdate");
        let changement: {
            name?: {
                old: any,
                new: any
            },
            topic?: {
                old: any,
                new: any
            },
            parent?: {
                old: any,
                new: any
            },
        } = {};
        if (oldChannel?.name != newChannel.name) changement.name = {
            old: oldChannel.name,
            new: newChannel.name,
        };
        // @ts-ignore
        if (oldChannel?.topic != newChannel?.topic) changement.topic = {
            // @ts-ignore
            old: oldChannel?.topic,
            // @ts-ignore
            new: newChannel?.topic,
        };
        if (oldChannel?.parentId != newChannel?.parentId) changement.parent = {
            old: oldChannel?.parentId,
            new: newChannel?.parentId,
        };
        if(!Object.entries(changement))return

        let logEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`Logs | ${this.name}`).setTimestamp().setDescription(`Channel ID : ${newChannel.id} (<#${newChannel.id}>)`)
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