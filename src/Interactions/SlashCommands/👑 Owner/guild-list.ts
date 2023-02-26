import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {EagleClient} from "../../../structures/Client";
import {DiscordColor} from "../../../structures/Enumerations/Embed";

export default {
    data: new SlashCommandBuilder()
        .setName("guild-list")
        .setDescription("vous permet d'avoir la liste des serveurs du bot"),
    execute(interaction: ChatInputCommandInteraction, client: EagleClient) {

        let nameArray = [];
        let valueArray = [];
        Promise.all(
            client.guilds.cache.map(async guild => {
                nameArray.push(guild.name);
                valueArray.push(`Owner: \`${(await client.users.fetch(guild.ownerId)).tag}\`\nNombre membres: \`${guild.memberCount}\`\nCréation <t:${Math.round(guild.createdAt.getTime() / 1000)}:R>`)
            })
        ).then(() => {
            let guildEmbed = new EmbedBuilder()
                .setTitle(`Liste des ${valueArray.length} serveurs du bot.`)
                .setColor(DiscordColor.DarkGreen);
            if (valueArray.length > 25) {
                client.func.utils.pagination(guildEmbed, nameArray, valueArray, interaction);
            } else {
                interaction.reply({
                    embeds: [
                        guildEmbed.setFields(
                            [... Array(valueArray.length).keys()].map(x => {
                                return {
                                    name: nameArray[x],
                                    value: valueArray[x],
                                }
                            })
                        )
                    ]
                })
            }
        }).catch(err => client.error(`Guild-list : ${err}`))
    }
}