import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, TextChannel} from "discord.js";
import {EagleClient} from "../../structures/Client";
import {DiscordColor} from "../../structures/Enumerations/Embed";

export default {
    execute(interaction: ButtonInteraction, client: EagleClient) {
        interaction.channel.setName(`${interaction.channel.name.split("-")[0]}-open`);
        interaction.channel.fetch().then(channel => {
            (channel as TextChannel).permissionOverwrites.edit(channel?.topic, {
                ViewChannel: true
            }).then(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(DiscordColor.Eagle)
                            .setTitle("Ticket Réouvert !")
                            .setDescription(`Ticket réouvert par \`${interaction.user.tag}\``)
                            .setTimestamp()
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setLabel("Fermer le ticket")
                                .setCustomId("ticketClose")
                                .setEmoji("🔒")
                                .setStyle(ButtonStyle.Secondary)
                        )
                    ]
                })
            })
        })
    }
}