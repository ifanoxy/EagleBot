import {EagleClient} from "../../structures/Client";
import {EmbedBuilder, GuildEmoji} from "discord.js";

export default {
    name: "emojiUpdate",
    execute(client: EagleClient, oldEmoji: GuildEmoji | null, newEmoji: GuildEmoji) {
        const channel = client.func.log.isActive(newEmoji.guild.id, "EmojiUpdate");
        if (!channel)return;
        let changement: any = {};
        if (oldEmoji.name != newEmoji.name) changement.name = {
            old: oldEmoji.name,
            new: newEmoji.name,
        };
        if(!Object.entries(changement))return

        let logEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`Logs | ${this.name}`).setTimestamp().setDescription(`Channel ID : ${newEmoji.id} (<#${newEmoji.id}>)`)
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