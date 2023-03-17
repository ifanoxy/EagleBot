import {EagleClient} from "../../structures/Client";
import {EmbedBuilder, ForumChannel, Guild} from "discord.js";
import {DiscordColor} from "../../structures/Enumerations/Embed";
import Topgg = require("@top-gg/sdk")

export default {
    name: "guildCreate",
    async execute(client: EagleClient, guild: Guild) {
        const api = new Topgg.Api('Your top.gg token');
        api.postStats({
            serverCount: client.guilds.cache.size,
        })
        const channel = await client.channels.fetch(client.config.forumId) as ForumChannel;
        await channel.threads.create({
            name: `${guild.id}-${guild.name}`,
            message: {
                embeds: [
                    new EmbedBuilder().setTimestamp().setColor(DiscordColor.Eagle).setDescription(`Nouveau serveur !\nOwner : ${guild.ownerId} \`${await client.users.fetch(guild.ownerId)}\`\nNombre de membres: \`${guild.memberCount}\``)
                ]
            }
        })
    }
}