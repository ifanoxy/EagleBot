import {EagleClient} from "../../structures/Client";
import {ForumChannel, Guild} from "discord.js";

export default {
    name: "guildDelete",
    async execute(client: EagleClient, guild: Guild) {
        const channel = await client.channels.fetch(client.config.forumId) as ForumChannel;
        await channel.threads.cache.find(x => x.name.split("-")[0] == guild.id).delete("Guild Leave")
    }
}